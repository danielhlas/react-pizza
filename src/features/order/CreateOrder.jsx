import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { createOrder } from '../../services/apiRestaurant';
import { clearCart, getCartItems } from '../cart/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import store from '../../../store';
import Button from '../../ui/Button';
import EmptyCart from '../cart/EmptyCart';
import { fetchAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );



function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const {name, status, position, address, error} = useSelector(state => state.user)
  console.log(error)
  const isAdressLoading = status === 'loading';
  const priceOfCart = useSelector(state => state.cart.cart.reduce((acc, currItem) => acc + currItem.totalPrice, 0));

  const formErrors = useActionData();
  const dispatch = useDispatch();
  const cart = useSelector(getCartItems)

  const [withPriority, setWithPriority] = useState(false);
  const priceWithPriority = withPriority ? (priceOfCart + (priceOfCart * 0.2)) : priceOfCart;

  if (cart.length === 0) {return <EmptyCart/>}

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" name="customer" defaultValue={name} required />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              defaultValue={address.address}
              disabled={isAdressLoading}
              required
            />
            {error === "User denied Geolocation" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {error}
              </p>)}
          </div>

        {!position.latitude && !position.longitude &&
          <span className='absolute right-[3px] top-[3px] md:right-[5px] md:top-[5px] z-20'>
            <Button type="small" disabled={isAdressLoading} onClick={(e)=>{
              e.preventDefault() //zabrání odeslání formuláře, ptž jde o button ve formuláři
              dispatch(fetchAddress())
            }}>Get Location</Button>
          </span>
         }
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting || isAdressLoading} type="primary">
            {isSubmitting ? 'Placing order....' : 'Order now for ' + formatCurrency(priceWithPriority)}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  // If everything is okay, create new order and redirect
  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;

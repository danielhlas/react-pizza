import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { numberOfOrderedPizzas } from './cartSlice';
import { sumPriceOfCart } from './cartSlice';

function CartOverview() {
  const numberOfOrderedPizzas2 = useSelector(numberOfOrderedPizzas)
  const sumPriceOfCart2 = useSelector(sumPriceOfCart)
  if (!numberOfOrderedPizzas2) return null;

  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold text-stone-300 sm:space-x-6">
        <span>{numberOfOrderedPizzas2} pizzas</span>
        <span>${sumPriceOfCart2}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;

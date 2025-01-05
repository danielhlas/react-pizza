import { useDispatch } from "react-redux"
import Button from "../../ui/Button"
import { decreaseItemQuantity, increaceItemQuantity } from "./cartSlice"

function ChangeQuantity({pizzaId, currentQuantity}) {
    const dispatch = useDispatch()

    return (
        <div className="flex gap-1 item-center md:gap-3">
            <Button type="round" onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>-</Button>
            <span className="flex items-center gap-2">{currentQuantity}</span>
            <Button type="round" onClick={() => dispatch(increaceItemQuantity(pizzaId))}>+</Button>
        </div>
    )
}

export default ChangeQuantity

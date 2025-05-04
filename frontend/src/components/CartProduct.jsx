import { useNavigation } from '../middleware/NavigationProvider';

export default function CartProduct({ item, cart }) {

    const navigate = useNavigation();

    const Remove = (event) => {
        cart.RemoveFromCart(event, item.id);
    }

    const Add = (event) => {
        cart.AddToCart(event, item);
    }

    const ViewProduct = () => {
        navigate(`/view/${item.handle}`);
    }

    return <div onClick={ViewProduct}>
        <h2>{item.title}</h2>
        {cart.isItemInCart(item.id) ? <button onClick={Remove}>Remove From Cart</button> : <button onClick={Add}>Add To Cart</button>}
    </div>
}
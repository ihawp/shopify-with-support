import { useContext } from 'react';
import { useNavigation } from '../middleware/NavigationProvider';

import { CartContext } from '../middleware/CartProvider';

export default function Product({ node }) {

    const { addItemToCart, removeItemFromCart, isItemInCart, updateItemQuantity, loadingCart } = useContext(CartContext);

    const navigate = useNavigation();

    const ViewProduct = (event) => {
        // use handle as link for individual page
        let handle = node.handle;
        navigate(`/view/${handle}`);
    }

    const AddToCart = (event) => {
        event.stopPropagation();
        addItemToCart(node);
    }

    const RemoveFromCart = (event) => {
        event.stopPropagation();
        removeItemFromCart(node.id);
    }

    return <div onClick={ViewProduct}>
        <h2>{node.title}</h2>
        {node.images?.edges[0]?.node?.url && (
            <img src={node.images.edges[0].node.url} alt={node.title} width={100} draggable="false" />
        )}
        {isItemInCart(node.id) ? <button onClick={RemoveFromCart}>Remove From Cart</button> : <button onClick={AddToCart}>Add To Cart</button> }
    </div>;
}
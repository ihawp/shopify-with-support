import { useContext } from 'react';
import { useNavigation } from '../middleware/NavigationProvider';

import { CartContext } from '../middleware/CartProvider';

import '../styles/Product/product.css';

export default function Product({ node }) {

    const { addItemToCart, removeItemFromCart, isItemInCart, updateItemQuantity, loadingCart } = useContext(CartContext);

    const navigate = useNavigation();

    const ViewProduct = (event) => {
        // use handle as link for individual page
        let handle = node.handle;
        navigate(`/product/${handle}`, {
            state: { gid: node.id }
        });
    }

    const AddToCart = (event) => {
        event.stopPropagation();
        addItemToCart(node);
    }

    const RemoveFromCart = (event) => {
        event.stopPropagation();
        removeItemFromCart(node.id);
    }

    return <div onClick={ViewProduct} className='product p-1'>
        {node?.images?.edges[0]?.node?.url && (
            <div className="img-container">
                <img src={node.images.edges[0].node.url || 'default-image.png'} alt={node.title} width={100} draggable="false" />
                <div className='img-overlay flex items-center justify-center'>
                    <button className='py-1 px-0-5'>View Details</button>
                </div>
            </div>
        )}
        <div className="flex flex-col items-start w-100">
            <div className="content-container">
                <h2>{node.title}</h2>
                <p>{node?.description ? node.description.slice(0, 100).trim() + '...' : 'No Description Available.'}</p>
            </div>
            <div className='button-container'>
                <p aria-label="Price">{`$${node?.variants?.edges[0]?.node?.price?.amount}0 ${node?.variants?.edges[0]?.node?.price?.currencyCode}`}</p>
                {isItemInCart(node.id) ? <button className="p-0-5 h-min min-w-1-5" onClick={RemoveFromCart}>Remove From Cart</button> : <button className="p-0-5 h-min min-w-1-5" onClick={AddToCart}>Add To Cart</button> }
            </div>
        </div>
    </div>;
}
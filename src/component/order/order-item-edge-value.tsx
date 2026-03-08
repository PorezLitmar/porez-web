import {type OrderEdge, type OrderItem, ProductPosition, Unit} from '../../api/model/porez';
import {useContext} from 'react';
import {AppContext} from '../../state';
import {formatNumber, getEnumValue} from '..';

const OrderItemEdgeValue = ({position, item, edges}: {
    position: ProductPosition,
    item: OrderItem,
    edges: OrderEdge[]
}) => {
    const appState = useContext(AppContext);

    const getEdgeId = () => {
        return item.product?.edges.find(edge => edge.position === position)?.materialId;
    }

    const getEdgeText = () => {
        const id = getEdgeId();
        if (id !== undefined) {
            const edge = edges.find(item => item.id === id);
            return edge ? `${edge.name} ${formatNumber(edge.width)}x${formatNumber(edge.thickness)} ${getEnumValue(Unit.MILLIMETER, appState?.units ?? [])}` : '';
        }
        return '';
    }

    return (
        <span className="text-xs">{getEdgeText()}</span>
    )
}

export default OrderItemEdgeValue;
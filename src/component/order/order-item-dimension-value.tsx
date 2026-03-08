import type {OrderItem} from '../../api/model/porez';
import {formatNumber} from '..';

const OrderItemDimensionValue = ({item}: { item: OrderItem }) => {

    const formatDimensions = () => {
        return `${formatNumber(item.product?.length)} x ${formatNumber(item.product?.width)}`;
    }

    return (
        <span className="text-xs">{formatDimensions()}</span>
    )
}

export default OrderItemDimensionValue;
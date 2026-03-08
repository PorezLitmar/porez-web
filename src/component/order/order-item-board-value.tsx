import {type OrderBoard, type OrderItem, ProductPosition} from '../../api/model/porez';

const OrderItemBoardValue = ({item, boards}: { item: OrderItem, boards: OrderBoard[] }) => {

    const getBoardId = () => {
        return item.product?.layers
            .find(layer => layer.level === 0)?.items
            .find(item => item.position === ProductPosition.A1)?.materialId;
    }

    const getBoardText = () => {
        const id = getBoardId();
        const board = boards.find(item => item.id === id);
        return board ? `${board.boardCode} ${board.structureCode} ${board.name}` : '';
    }

    return (
        <span className="text-xs">{getBoardText()}</span>
    )
}

export default OrderItemBoardValue;
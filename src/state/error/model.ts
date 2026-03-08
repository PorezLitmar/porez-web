import type {ErrorMessage} from '../../api/model/porez';

export interface ErrorState {
    data: ErrorMessage[],
    addError: (error?: ErrorMessage) => void,
    removeError: (index: number) => void
}

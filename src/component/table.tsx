import type {ReactNode} from 'react';

const Table = <F, R>(
    {
        fields,
        tableHeaderColumn,
        rows,
        tableRowKey,
        tableRowColumn,
        onRowSelected
    }: {
        fields: F[],
        tableHeaderColumn: (field: F) => ReactNode,
        rows?: R[],
        tableRowKey: (row: R) => string,
        tableRowColumn: (field: F, row: R, rowIndex: number) => ReactNode,
        onRowSelected?: (row: R) => void
    }) => {

    const headRow = (
        <tr>
            {fields?.map(field => tableHeaderColumn(field))}
        </tr>
    );

    const dataRows = (
        <>
            {rows?.map((row, rowIndex) =>
                <tr
                    key={tableRowKey(row)}
                    onClick={() => {
                        if (onRowSelected) {
                            onRowSelected(row);
                        }
                    }}>
                    {fields?.map(field => tableRowColumn(field, row, rowIndex))}
                </tr>
            )}
        </>
    );

    return (
        <table className="table table-xs table-pin-rows w-full">
            <thead>
            {headRow}
            </thead>
            <tbody>
            {dataRows}
            </tbody>
        </table>
    )
}

export default Table;

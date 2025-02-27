import React from 'react';
import { showNotice } from '../context/store';
import { IconRenderer } from '../common/icons/icon-renderer';

// Stubs for missing components
const IconButtonDelete = (props) => (
    <button {...props} onClick={props.deleteHandler} title="Delete">
        <span style={{ color: 'red', fontSize: props.size }}>🗑️</span>
    </button>
);

const DataJSONView = (props) => (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000, boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
        <h3>JSON Data</h3>
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
        <button onClick={props.onClose}>Close</button>
    </div>
);

const BusyIcon = ({ isLoading }) => isLoading ? <span>⌛</span> : null;

const Icon = ({ name, color, size }) => {
    const icons = {
        FaEdit: '✏️',
        FaEye: '👁️',
        FaClone: '📋'
    };
    return <span style={{ color, fontSize: size }}>{icons[name] || '⚠️'}</span>;
};

// Stub for requestQueueInstance
const requestQueueInstance = {
    deleteData: async (datatype, id) => {
        console.log(`Deleting ${id} from ${datatype}`);
        return { success: true };
    },
    getDataById: async (datatype, id) => {
        console.log(`Getting ${id} from ${datatype}`);
        return { sk: id, datatype, data: {} };
    }
};

const iconSize = 12;
export const RowHandler: React.FC<any> = (props: { options?; row; onRowEvent: (event, id, row) => boolean; datatype; onRowDataEvent }) => {
    const { row, onRowEvent } = props;
    const [showJSON, setShowJSON] = React.useState<any>(false);
    const [isLoading, setIsLoading] = React.useState<any>(false);

    const deleteHandler = async () => {
        if (onRowEvent) {
            const rt = await onRowEvent('delete', row.id, row);
            if (rt === true) {
                return;
            }
        }
        if (props.datatype) {
            setIsLoading(true);
            await requestQueueInstance
                .deleteData(props.datatype, row.original.sk)
                .then(res => {
                    showNotice(props.datatype.toUpperCase() + ' deleted', 'info');
                    if (props.onRowDataEvent) {
                        props.onRowDataEvent('delete', row.original.sk, row);
                    }
                })
                .catch(e => {
                    console.error(e);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const rowEditHandler = async e => {
        e.preventDefault();
        e.stopPropagation();

        if (onRowEvent) {
            const rt = await onRowEvent('edit', row.id, row);
            if (rt === true) {
                return;
            }
        }
        setIsLoading(true);
        const data = await requestQueueInstance
            .getDataById(props.datatype, row.original.sk)
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });

        if (props.datatype) {
            // useSiteStore.getState().setStateItem({ dataFormProps: { data: data, datatype: props.datatype } });
        }
        console.log('rowEditHandler', row);
    };

    const rowJSONViewHandler = async e => {
        e.preventDefault();
        e.stopPropagation();

        if (onRowEvent) {
            const rt = await onRowEvent('view', row.id, row);
            if (rt === true) {
                return;
            }
        }
        setShowJSON(!showJSON);
        console.log('rowJSONViewHandler', row);
    };

    const rowCloneHandler = async e => {
        e.preventDefault();
        e.stopPropagation();

        if (onRowEvent) {
            const rt = await onRowEvent('clone', row.id, row);
            if (rt === true) {
                return;
            }
        }
        console.log('rowCloneHandler', row);
    };

    const canEdit = props.options?.rowEdit !== false && props.options?.readOnly !== true;
    const canDelete = props.options?.rowDelete !== false && props.options?.readOnly !== true;
    const canClone = props.options?.rowClone !== false && props.options?.readOnly !== true;
    return (
        <div className="flex gap-0 mr-2 items-center">
            <div className="">
                <BusyIcon isLoading={isLoading} />
            </div>
            {canEdit && (
                <button
                    onClick={rowEditHandler}
                    title="Edit"
                    className="p-1 bg-gray-100  border-white border-2 rounded-full  hover:scale-125 block transition-all duration-200 shadow "
                >
                    <IconRenderer icon="Edit" color="blue" size={iconSize} />
                </button>
            )}
            <button title="View JSON" onClick={rowJSONViewHandler} className="p-1 bg-gray-100 border-2  border-white rounded-full shadow hover:scale-125 block transition-all duration-200">
                <IconRenderer icon="Eye" color="orange" size={iconSize} />
            </button>
            {canClone && (
                <button title="Clone" onClick={rowCloneHandler} className="p-1 bg-gray-100 border-2  border-white rounded-full shadow hover:scale-125 block transition-all duration-200">
                    <IconRenderer icon="Copy" color="green" size={iconSize} />
                </button>
            )}
            {canDelete && <IconButtonDelete size={iconSize} deleteHandler={deleteHandler} className="p-1 bg-gray-100 border-2  border-white rounded-full shadow hover:scale-125 block transition-all duration-200" />}

            {showJSON && <DataJSONView key={row.id} datatype={row.original.datatype} uid={row.original.sk} data={row.original} onClose={e => setShowJSON(false)} />}
        </div>
    );
};

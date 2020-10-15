import React, { Component } from 'react';


import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './Table.scss';
import DialogSuccess from './DialogSuccess';
import Dropdowns from '../Dropdown/Dropdowns';
import moment from "moment";


class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            displayBasic: false,
            displayBasic1: false,
            displayADD: false,
            displayDel: false,
            displayDiaDel: false,
            displayThatBai: false,
            displayXoaThatBai: false,
            displaySuaThatBai: false,
            beginDate: "",
            endDate: "",
            name: "",
            code: "",
            status: "",
            id: "",
            position: 'center',
            globalFilter: '',
            loading: false,
            first: 0,
            totalRecords: 0,
            page: 1,
            filters: {},
            sortOrder:1,
            sortField:"id",
        };
        this.timeout = 0;
        this.statusBodyTemplate = this.statusBodyTemplate.bind(this);

    }

    onClick(name, position) {
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }
    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
        this.setState({
            beginDate: '',
            endDate: '',
            name: '',
            code: '',
            status: '',
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post('https://sale-api.ecolandvn.com/demo/api/selling_phase', {
            "beginDate": this.state.beginDate,
            "endDate": this.state.endDate,
            "name": this.state.name,
            "projectCode": this.state.code,
            "status": this.state.status
        }).then(res => this.post(this.props.code, this.state.page).then(res => {
            this.setState({ totalRecords: res.data.size });
            this.onClick('displayADD');
            this.onHide('displayBasic');
            this.setState({ data: res.data.result });
        })).catch(Error => this.onClick('displayThatBai'));

    }
    handleSave(e, data) {
        this.setState({
            id: e.id,
            beginDate: new Date(moment(e.beginDate).format('llll')),
            endDate: new Date(moment(e.endDate).format('llll')),
            name: e.name,
            code: e.projectCode,
            status: e.status,
        });
        this.onClick('displayBasic1');
    }
    handleSubmit1(e) {
        e.preventDefault();
        axios.put('https://sale-api.ecolandvn.com/demo/api/selling_phase', {
            "beginDate": this.state.beginDate,
            "endDate": this.state.endDate,
            "id": this.state.id,
            "name": this.state.name,
            "projectCode": this.state.code,
            "status": this.state.status
        }).then(res => this.post(this.props.code, this.state.page).then(res => {
            this.onHide('displayBasic1');
            this.setState({ data: res.data.result });
            this.setState({
                beginDate: '',
                endDate: '',
                name: '',
                code: '',
                status: '',
            });

        })).catch(Error => this.onClick('displaySuaThatBai'));


    }
    handleDelete() {
        axios.delete(`https://sale-api.ecolandvn.com/demo/api/selling_phase/${this.state.id}`).then(res => this.post(this.props.code, this.state.page).then(res => {
            this.setState({ totalRecords: res.data.size });
            this.onHide('displayDel');
            this.onClick('displayDiaDel');
            this.setState({ data: res.data.result });
        }))
            .catch(Error => this.onClick('displayXoaThatBai'));


    }
    openDialogDel(e, data) {
        this.setState({ id: e.id });
        this.onClick('displayDel');
    }
    post(code, page, filter , sort) {
        var filters = [];
         for (const item in filter){
            filters.push( {
                "key": item,
                "operation": "EQUALITY",
                "operator": "and",
                "value": filter[item].value
            })
            
        }
        return axios.post(`https://sale-api.ecolandvn.com/demo/api/selling_phase/filter/${code}/${page}/11`, {
            "filters": filter ? filters : [],
            "orders": sort ?[ {
                "asc": sort.sortOrder == 1 ? true : false , 
                "key":  sort.sortField,
            } ] :  [
                {
                    "asc": true,
                    "key": "id"
                }
            ]
        });
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.post(this.props.code, 1).then(res => {
            this.setState({
                totalRecords: res.data.size,
                data: res.data.result,
                loading: false
            });
        })

    }
    onPage(event) {
        const { first, rows } = event;
        const page = (first / 10) + 1;
        this.setState({ loading: true, page: page });
        this.post(this.props.code, page).then(res => {
            this.setState({
                first,
                data: res.data.result,
                loading: false
            });
        })

    }
    statusBodyTemplate(rowData) {
        return <Checkbox checked={rowData.status == true ? true : false}></Checkbox>
    }
    btn(e, data) {
        return (
            <div>
                <Button label="Save" icon="pi pi-save" className="p-button-sm p-mr-3 p-button-raised p-button-text" onClick={() => this.handleSave(e, data)} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-raised p-button-text" onClick={() => this.openDialogDel(e, data)} />
            </div>
        )
    }

    renderHeader() {
        return (
            <div className="table-header">
                <div className='p-d-flex p-flex-column'>
                    <span>Danh sach du an</span>
                </div>
                <div className="p-input-icon-left">
                    <i className="pi pi-search " />
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Global Search" />
                    <br />
                    <Button label="Add" icon="pi pi-plus" className="p-button-sm p-mr-3 btnAdd p-button-raised p-button-text" style={{ width: '100px' }} onClick={() => this.onClick('displayBasic')} />
                </div>
            </div>
        );
    }
    renderFooter(name) {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={() => this.handleDelete()} autoFocus />
            </div>
        );
    }
    change(e) {
        this.setState({ code: e.value });
    }
    filter(e) {
        this.setState({ filters: e.filters })
        console.log(e.filters);
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({ loading: true });
             if(Object.keys(e.filters).length == 0){
                this.post(this.props.code, this.state.page).then(res => {
                    this.setState({
                        totalRecords: res.data.size,
                        data: res.data.result,
                        loading: false
                    });
                })
             }else{
                this.post(this.props.code, this.state.page, e.filters).then(res => {
                    this.setState({
                        totalRecords: res.data.size,
                        data: res.data.result,
                        loading: false
                    });
                })
    
             }
        }, 2000);


    }
    sort(e){
        console.log(e);
        this.setState({sortField: e.sortField, sortOrder: e.sortOrder}) ;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({ loading: true });
                this.post(this.props.code, this.state.page, this.state.filters , e).then(res => {
                    this.setState({
                        totalRecords: res.data.size,
                        data: res.data.result,
                        loading: false
                    });
                })
             
        }, 2000);
        
    }
    render() {
        const header = this.renderHeader();

        return (
            <div className="datatable-doc-demo">
                <div className="card">
                    <DataTable ref={(el) => this.datatable = el} value={this.state.data} header={header} rowHover className="p-datatable-customers" globalFilter={this.state.globalFilter}
                        paginator rows={10} totalRecords={this.state.totalRecords - 1}
                        lazy first={this.state.first} onPage={(e) => this.onPage(e)} loading={this.state.loading} onFilter={(e) => this.filter(e)} filters={this.state.filters}
                        sortField={this.state.sortField} sortOrder={this.state.sortOrder}  onSort={(e) => this.sort(e)} 
                    >
                        <Column field="id" header="Code" sortable filter filterPlaceholder="Search by code"></Column>
                        <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" ></Column>
                        <Column field="projectCode" header="Code" sortable ></Column>
                        <Column header="Status" body={this.statusBodyTemplate} ></Column>
                        <Column body={(e, data) => this.btn(e, data)}></Column>
                    </DataTable>



                    <Dialog header="Them" visible={this.state.displayBasic} style={{ width: '50vw' }} onHide={() => this.onHide('displayBasic')}>
                        <form onSubmit={(event) => this.handleSubmit(event)}>
                            <div className="Form">
                                <label htmlFor="icon">BeginDate</label>
                                <Calendar id="icon" value={this.state.beginDate} onChange={(e) => this.setState({ beginDate: e.value })} showIcon />
                            </div>
                            <div className="Form">
                                <label htmlFor="icon">EndDate</label>
                                <Calendar id="icon" value={this.state.endDate} onChange={(e) => this.setState({ endDate: e.value })} showIcon style={{ marginRight: '-1px' }} />
                            </div>
                            <div className="Form">
                                <span>Name</span>
                                <InputText onChange={(e) => this.setState({ name: e.target.value })} style={{ width: "236px", marginRight: '-10px' }} />
                            </div >
                            <div className="Form">
                                <span>Code</span>
                                <Dropdowns value={this.state.code} options={this.props.option} change={(e) => this.change(e)} />
                            </div>
                            <div className="FormCheck">
                                <span>status</span>
                                <Checkbox className="checkbox" onChange={e => this.setState({ status: e.checked })} checked={this.state.status}></Checkbox>
                            </div>

                            <div className="FormButton">
                                <Button label="Submit" type="submit" className="p-button-sm " />
                            </div>
                        </form>
                    </Dialog>
                    <Dialog header="Sua" visible={this.state.displayBasic1} style={{ width: '50vw' }} onHide={() => this.onHide('displayBasic1')}>
                        <form onSubmit={(event) => this.handleSubmit1(event)}>
                            <div className="Form">
                                <label htmlFor="icon">Id</label>
                                <InputText value={this.state.id} style={{ width: "236px", marginRight: '-21px' }} disabled />
                            </div>
                            <div className="Form">
                                <label htmlFor="icon">BeginDate</label>
                                <Calendar id="icon" value={this.state.beginDate} onChange={(e) => this.setState({ beginDate: e.value })} showIcon />
                            </div>
                            <div className="Form">
                                <label htmlFor="icon">EndDate</label>
                                <Calendar id="icon" value={this.state.endDate} onChange={(e) => this.setState({ endDate: e.value })} showIcon style={{ marginRight: '-1px' }} />
                            </div>
                            <div className="Form">
                                <span>Name</span>
                                <InputText value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} style={{ width: "236px", marginRight: '-10px' }} />
                            </div >
                            <div className="Form">
                                <span>Code</span>
                                <InputText value={this.state.code} onChange={(e) => this.setState({ code: e.target.value })} style={{ width: "236px", marginRight: '-10px' }} />
                            </div>
                            <div className="FormCheck">
                                <span>status</span>
                                <Checkbox className="checkbox" onChange={e => this.setState({ status: e.checked })} checked={this.state.status}></Checkbox>
                            </div>

                            <div className="FormButton">
                                <Button label="Submit" type="submit" className="p-button-sm " />
                            </div>
                        </form>
                    </Dialog>
                    <DialogSuccess titile="Xoa thanh cong" visible={this.state.displayDiaDel} onHide={() => this.onHide('displayDiaDel')} />
                    <DialogSuccess titile="Them thanh cong" visible={this.state.displayADD} onHide={() => this.onHide('displayADD')} />
                    <DialogSuccess header="Confirm" footer={this.renderFooter('displayDel')} titile="Ban chac chan muon xoa" visible={this.state.displayDel} onHide={() => this.onHide('displayDel')} />
                    <DialogSuccess titile="Them that bai" visible={this.state.displayThatBai} onHide={() => this.onHide('displayThatBai')} />
                    <DialogSuccess titile="Xoa that bai" visible={this.state.displayXoaThatBai} onHide={() => this.onHide('displayXoaThatBai')} />
                    <DialogSuccess titile="Sua that bai" visible={this.state.displaySuaThatBai} onHide={() => this.onHide('displaySuaThatBai')} />

                </div>
            </div>
        );
    }
}

export default Table;
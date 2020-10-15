import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
class DialogSuccess extends Component {
    
    render() {
        return (
            <Dialog header={this.props.header} footer={this.props.footer} visible={this.props.visible} style={{ width: '400px' }} onHide={() => this.props.onHide('displayADD')}>
                <div className={this.props.titile == "Them thanh cong" || this.props.titile == "Xoa thanh cong" ? "text" : "text-red"}>{this.props.titile}</div>
                {this.props.titile == "Xoa thanh cong" &&  <Button icon="pi pi-check icon-add" className=" p-mr-3 p-button-rounded p-button-outlined  wi p-button-success"  />}
                {this.props.titile == "Them thanh cong" &&  <Button icon="pi pi-check icon-add" className=" p-mr-3 p-button-rounded p-button-outlined  wi p-button-success"  />}
                {this.props.titile == "Them that bai" &&  <Button icon="pi pi-times icon-add" className=" p-mr-3 p-button-rounded p-button-outlined  wi p-button-danger"  />}
                {this.props.titile == "Xoa that bai" &&  <Button icon="pi pi-times icon-add" className=" p-mr-3 p-button-rounded p-button-outlined  wi p-button-danger"  />}
                {this.props.titile == "Sua that bai" &&  <Button icon="pi pi-times icon-add" className=" p-mr-3 p-button-rounded p-button-outlined  wi p-button-danger"  />}
            </Dialog>
        );
    }
}

export default DialogSuccess;
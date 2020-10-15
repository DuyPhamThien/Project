import React, { Component } from 'react';
import './App.css';
import Home from './components/Home/Home';


const axios = require('axios');


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            id: 1,
        }
    }
    getA = () => {
        return axios.get("https://base-api.ecolandvn.com/demo/api/project/getActiveProject/client-sale");
    };
    componentDidMount() {
        try {
            axios.defaults.headers.common['authorization'] = `Bearer ${global.keycloak.token}`;
            this.getA().then((res) => {
                var data = res.data;
                var changedData = {};
                data.map(item => {
                    changedData[item['id']] = item;
                })
                this.setState({
                    data: changedData,
                    id: this.state.id + 1,
                });
            });

        } catch (error) {
            console.log(error);
        }
    }
  

    render() {
        var { data } = this.state;
        return (
              <Home  key={this.state.id} data={data} />
                
        );
    }
}

export default App;
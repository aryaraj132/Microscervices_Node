import { Component} from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./pages/home";
import Upload from "./pages/upload";
import Login from "./pages/login";
import Register from "./pages/Register";
import PageWrapper from "./PageWrapper";
export default class App extends Component{
    constructor(props){
        super(props);
        this.state={data:JSON.parse(localStorage.getItem('UserInfo'))}
    }
    updateState =(newData)=>{
        this.setState({data:newData})
    }
    render(){
        return (
            <Router>
                <PageWrapper data={this.state.data} changeState={this.updateState}>
                    <Route
                    exact={true}
                    path="/"
                    render={(props) => <Home {...props} data={this.state.data} changeState={this.updateState} />}
                    />
                    <Route
                    path="/upload"
                    render={(props) => <Upload {...props} data={this.state.data} changeState={this.updateState} />}
                    />
                    <Route
                    path="/login"
                    render={(props) => <Login {...props} data={this.state.data} changeState={this.updateState} />}
                    /><Route
                    path="/register"
                    render={(props) => <Register {...props} data={this.state.data} changeState={this.updateState} />}
                    />
                </PageWrapper>
            </Router>
    );
    }
}
import React, { Component } from 'react';
import {Link, withRouter} from'react-router-dom';
import $ from 'jquery'
class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
        }
    }
    componentDidMount(){
       document.title = "Login"
       if(this.props.data !=null){
        this.props.history.push('/')
    }
     }
    handleChange = (e) =>{
        let value = e.target.value
        let id = e.target.id
        this.setState({[id]:value})
        let emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
        let passExp = new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,}")
        if(id=='email'){
            if(!emailExp.test(value)){
                $('#emailError').text(' * Invalid Format')}
            else{
                $('#emailError').text('');
            }
            if(emailExp.test(value) && passExp.test(this.state.password)){
                $("#submit").attr("disabled",false)
            }
        }
        if(id == 'password'){
            if(!passExp.test(value)){
                $('#passwordError').text(' * Your password must be more than 10 characters long, contain an Uppercase letters, a Lowercase letter and a number, and a special character [! @ # $ % ^ & *]')
            }
            else{
                $('#passwordError').text('');
            }
            if(emailExp.test(this.state.email) && passExp.test(value)){
                $("#submit").attr("disabled",false)
            }
        }
    }
    handleSubmit = (e) =>{
        $('#message').removeClass().text('')
        e.preventDefault();
        let emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
        let passExp = new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{10,}")
        $('#emailError').text("");
        $('#passwordError').text('');
        if(!passExp.test(this.state.password)){
            $('#passwordError').text(' * Your password must be more than 10 characters long, contain an Uppercase letters, a Lowercase letter and a number, and a special character [! @ # $ % ^ & *]')
        }
        else if(!emailExp.test(this.state.email)){
            $('#emailError').text(' * Invalid Format')}
        else{
            $('#message').addClass('text-green').text('Sending request please wait...');
            $("#submit").attr("disabled",true).text('Sending...');
            $('#emailError').text("")
            $('#passwordError').text('')
            fetch("http://localhost:5000/user/login",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                }),
            }).then(function(response){
                $('#message').removeClass().text('')
                $("#submit").attr("disabled",false).text('Login');
                if(response.status != 200){
                    $('#message').addClass('text-red').text(`Error ${response.status}: ${response.statusText}`);
                }
                else{
                response.json().then(data =>{
                    if(data.error==undefined){
                        $('#message').addClass('text-green').text(data.message);
                        localStorage.setItem('UserInfo', JSON.stringify(data.data));
                        this.props.changeState(data.data)
                        this.props.history.push("/");
                    }
                    else{
                        $('#message').addClass('text-red').text(data.error);
                    }
                })}
            }.bind(this)).catch(error=>{
                $('#message').addClass('text-red').text(error)
            })
            
        }
    }
    render() {
        return (
            <main id="main">
                <section className="breadcrumbs">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center">
                    <h2>Login</h2>
                    </div>

                </div>
                </section>

                <section className="inner-page">
                    <div className="container">
                        <div className="form-container">
                            <span id="message"></span>
                            <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label for="email">Email</label>
                                        <input type="email" className="form-control" onChange={this.handleChange} id="email" placeholder="Enter Your Email" required />
                                        <small id="emailError" className="form-text text-muted text-red">
                                        </small>
                                    </div>
                                <div className="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" onChange={this.handleChange} id="password" name="password" className="form-control" aria-describedby="passwordHelpBlock" required />
                                    <small id="passwordError" className="form-text text-muted text-red"></small>
                                </div>
                                <br />
                                <button type="submit" id="submit" onClick={this.handleSubmit} className="btn btn-primary" disabled>Login</button>
                            </form>
                            <hr />
                            <div className="d-flex justify-content-around flex-wrap">
                        <p>New Here? <Link to="/register">Sign Up</Link> </p>
                        </div>
                        </div>
                    </div>
                </section>

            </main>
        )
    }
}
export default withRouter(Login)
import React, { Component } from 'react';
import {Link, withRouter} from'react-router-dom';
import $ from 'jquery'
class PageWrapper extends Component {
    mobileNavIcon = () =>{
        $("body").toggleClass("mobile-nav-active");
        $('#mobile-nav-icon').toggleClass("icofont-navigation-menu icofont-close")
        $('.mobile-nav-overly').toggle();
    }
    logout = (e) =>{
        e.preventDefault();
            localStorage.clear();
            this.props.changeState(null);
            this.props.history.push('/login')
    }
    render() {
        return (
            <div>
                <button type="button" className="mobile-nav-toggle d-lg-none" onClick={this.mobileNavIcon}><i id="mobile-nav-icon" className="icofont-navigation-menu"></i></button>
                <header id="header" className="fixed-top">
                    <div className="container d-flex align-items-center">

                    <h1 className="logo mr-auto"><Link to="/">Pratilipi</Link></h1>

                    <nav className="nav-menu d-none d-lg-block">
                        <ul>
                        <li><Link to="/">Home</Link></li>
                        {this.props.data == null ?
                        <li><Link to="/login">Login</Link></li>
                        :
                        <li><Link onClick={this.logout} to="/login">Logout</Link></li>
                        }
                        </ul>
                    </nav>


                    </div>
                </header>
                <nav className="mobile-nav d-lg-none">
                    <ul>
                    <li><Link onClick={this.mobileNavIcon} to="/">Home</Link></li>
                    {this.props.data == null ?
                        <li><Link onClick={this.mobileNavIcon} to="/login">Login</Link></li>
                        :
                        <li><Link onClick={(e)=>{this.logout(e);this.mobileNavIcon(e)}} to="/login">Logout</Link></li>
                        }
                    </ul>
                </nav>
                {this.props.children}
            </div>

        )
    }
}

export default withRouter(PageWrapper)
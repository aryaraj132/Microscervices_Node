import React, { Component } from 'react';
import $ from 'jquery'
export default class Home extends Component {
    constructor(props){
        super(props);
        this.state={
            load:false,
        }
        this.data = null
    }
    componentDidMount(){
       document.title = "Home | Pratilipi"
       if(this.props.data ==null){
        this.props.history.push('/login')
        }
        else{
        fetch("http://localhost:4000/content",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    userID: this.props.data.id
                }),
            }).then((response) => response.json()).then((data) => {
                this.data = data
                console.log(this.data,this.props.data.id);
                this.setState({load:true})
            })
        }
     }
     componentWillUnmount(){
         this.data = null
     }
     like = (e,id,likes,index) =>{
        e.preventDefault();
        let el = e.target
        fetch("http://localhost:5000/user/updateliked",{
                method: "post",
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    LikedBy: this.props.data.id,
                    ContentID: id,
                }),
            }).then((response) => response.json()).then((data) => {
                this.data.content[index].Likes = data.data
                if (data.data>likes) {
                    $(el).html("Liked  "+data.data)
                }
                else{
                    $(el).html("Like  "+data.data)
                }
            })
            
    }
    render() {
        return (
            <main id="main">
                <section className="breadcrumbs">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center">
                    <h2>Home</h2>
                    </div>

                </div>
                </section>
                {this.state.load ?
                <section className="home">
                <div className="container">
                    {this.data.content.map((data,i)=>{
                        return(
                            <>
                        <div className="card">
                            <div className="card-header">
                                {data.Title}
                            </div>
                            <div className="card-body">
                                <h6 className="card-title" align="right">Story By : {data.userID} | Publisher on : {data.Published_At}</h6>
                                <p className="card-text">{data.Story}</p>
                                <hr></hr>
                                
                                <button onClick={(e)=>{this.like(e,data._id,data.Likes,i)}} className="btn btn-primary">{this.data.liked.find(o => o.ContentID === data._id)?'Liked':'Like'}  {data.Likes}</button>
                            </div>
                        </div>
                        <br />
                        </>
                        )
                    })}
                </div>
                </section>:
                <div className="loader"></div>
                }

            </main>
        )
    }
}

import React, { Component } from 'react';
import {withRouter} from'react-router-dom';
import $ from 'jquery'
class Upload extends Component {
    constructor(props){
        super(props);
        this.state={
            csv:null,
        }
    }
    componentDidMount(){
       document.title = "Upload CSV"
       if(this.props.data ==null){
        this.props.history.push('/login')
        }
     }
    fileChange = (e) =>{
        let el = e.target
        const url = URL.createObjectURL(el.files[0])
        this.setState({csv:el.files[0]})
    }
    handleSubmit = (e) =>{
        $('#message').removeClass().text('')
        e.preventDefault();
            $('#message').addClass('text-green').text('Sending request please wait...');
            $("#submit").attr("disabled",true).text('Sending...');
            let form_data = new FormData();
            form_data.append('csv', this.state.csv);
            fetch("http://localhost:4000/content/upload",{
                method: "POST",
                body: form_data,
            }).then(function(response){
                $('#message').removeClass().text('')
                $("#submit").attr("disabled",false).text('Submit');
                if(response.status != 200){
                    $('#message').addClass('text-red').text(`Error ${response.status}: ${response.statusText}`);
                }
                else{
                    response.json().then(data =>{
                        if(data.error==undefined){
                            if (data.data.length > 0) {
                                $('#message').addClass('text-green').html(data.message+'<br />'+data.data);
                            }else{
                                $('#message').addClass('text-green').text(data.message);
                            }
                        }
                        else{
                            $('#message').addClass('text-red').text(data.error);
                        }
                    })}
                }).catch(error=>{
                $('#message').addClass('text-red').text(error)
            });
        }
    render() {
        return (
            <main id="main">
                <section className="breadcrumbs">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-center">
                    <h2>Upload CSV</h2>
                    </div>

                </div>
                </section>
                {this.props.data!=null&& 
                <section className="inner-page">
                    <div className="container">
                        <div className="form-container">
                            <p id="message"></p>
                            <form onSubmit={this.handleSubmit} enctype="multipart/form-data">
                                <div className="form-group">
                                    <label for="csv">Upload CSV</label>
                                    <input type="file" accept="csv/*" onChange={this.fileChange} className="form-control-file" id="csv" name="csv" />
                                </div>
                                <br />
                                <button type="submit" onClick={this.handleSubmit} id="submit" className="btn btn-primary">Submit</button>
                            </form>
                        <hr />
                        </div>
                    </div>
                </section>
                }
            </main>
        )
    }
}
export default withRouter(Upload)
import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $ajax({url: 'http://talenttalent.azurewebsites.net/listing/listing/closeJob',

        headers: {
                        'Authorization': 'Bearer ' + cookies,
                  'Content-Type': 'application/json'
                 },
                 dataType:'json',
                 type:"post",
                 data:JSON.stringify(id),
                 success: function(res){
                     this.props.reloadData();
                     console.log("success")

                 }.bind(this)
        })
    }
    
    render() {
        var data= this.props.data
        var buttonSwitch=undefined;
        if (data.status ==0){
            buttonSwitch = 
            <div className="ui right floated mini buttons">
                <button
                  className="ui right floated mini basic blue button ">
                 
                      <i className="ban icon"/>Close
                  </button>
                  <button className =" ui right floated mini basic blue button"
                  onClick={()=> {window.location="/EditJob"+data.id}}>
                      <i className="edit icon"/>Edit</button>
                      <button className =" ui right floated mini basic blue button">
               
               <i className="copy icon"/>Copy</button>
            </div>
        }
        return(
            
            <div className="ui wide card">
                <div className="content">
                    <div className="header "><strong> {data.title}</strong></div>
                    <Popup trigger={
                        <a className="ui black right ribbon label">
                            <i className="user icon"></i>{data.noOfSuggestions}
                        </a>
                    }>
                        <span>Suggested Talents</span>
                    </Popup>
                    <div className ='meta'>{data.location.city},{data.location.country}</div>
                    <div className="description job-summary">{data.summary}</div>
                </div>
                <div className="extra-content">
                    {buttonSwitch !=undefined ? buttonSwitch :null}
                    {moment(data.expiryDate) < moment() ?
                    <label className="ui red leftfloated label">
                        Expired
                    </label>: null}
                </div>
                 
            </div>
            
            
            
            
          
            
            
        )
    }
}
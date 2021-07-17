import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown,  Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSortChange= this.handleSortChange.bind(this);
        this.handlePaginationChange=this.handlePaginationChange.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
       this.setState({ loaderData });//comment this

       // set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        //var url = 
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
       $.ajax({
        url: 'http://talenttalent.azurewebsites.net/listing/listing/getSortedEmployerJobs',
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        dataType:'json',
        type: "GET",
        data: {
            showActive:this.state.filter.showActive,
            showClosed:this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired:this.state.filter.showExpired,
            showUnexpired:this.state.filter.showUnexpired,
            sortByDate: this.state.sortBy.date,
            activePage:this.state.activePage
        },
        success: function (res) {
            this.setState({ loadJobs:res.myJobs, totalPages:Math.ceil(res.totalCount/6)}, callback);
           // console.log(res)("")
           // if (res.success == true) {
              //  TalentUtil.notification.show(res.message, "success", null, null);
              //  window.location = "/ManageJobs";
               
            //} else {
               // TalentUtil.notification.show(res.message, "error", null, null)
           // }
           
            
        }.bind(this),
        error:function(res){
            console.log(res.status)
        }
    })
    }
    handlePaginationChange(e,{activePage})
    {
        this.loadNewData({activePage :activePage});
    }
    handleSortChange(e,{value,name})
    {
        this.state.sortBy[name]= value;
        this.loadNewData({sortBy:this.state.sortBy});
    }

    handleFilter(e,{checked,name})
    {
        this.state.filter[name] =checked;
        this.setState({
            filter:this.state.filter
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
        
    }
    handleClick(e, titleProps)
    {
      const { index } = titleProps
      const { activeIndex }=this.state
      const newIndex= activeIndex === index ? -1 : index

     this.setState({activeIndex:newIndex})
    }
    render() {
        var res = undefined;
        if(this.state.loadJobs.length>0)
        {

            res = this. state. loadJobs.map(x=>
                <JobSummaryCard
                key={x.id}
                data={x}
                reloadData={this.loadData}
                />);
        }

        const options= [
            {
                key:'desc',
                text:'Newest first',
                value:'desc',
                content:'Newest first',
            },
            {
                key:'asc',
                text:'Oldest first',
                value:'asc',
                content:'Oldest first',
            }
        ];
        const {activeIndex}=this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container">
                   <div className="ui grid">
                   <div className="row">
                   <div className="sixteen wide column">
                   <h1>List of Jobs</h1>
                   <span>
                       <i className="filter icon"/>{"Filter :"}
                       <Dropdown inline simple text = "Choose filter">
                           <Dropdown.Menu>
                               <Dropdown.Item key={"status"}>
                                   <Accordion>
                                      <Accordion.Title active={activeIndex===1} index={1} onClick={this.handleClick}>
                                      <Icon name='dropdown'/>By status
                                      </Accordion.Title>
                                       <Accordion.Content active={activeIndex===1}>
                                           <Form>
                                               <Form.Group grouped>
                                                   <Form.Checkbox  label='Active Jobs'
                                                       name="showActive" onChange={this.handleFilter}checked={this.state.filter.showActive} />
                                                       <Form.Checkbox label= 'Closed Jobs'
                                                         name= "showClosed" onChange ={this.handleFilter} checked={this.state.filter.showClosed}/>
                                                         <Form.Checkbox label= 'Draft'
                                                          name="showDraft" onChange={this.handleFilter} checked={this.state.filter.showDraft}/>
                                                         
                                                   
                                               </Form.Group>
                                           </Form>
                                       </Accordion.Content>
                                   </Accordion>
                               </Dropdown.Item>

                               <Dropdown.Item key={"expiryDate"}>
                                   <Accordion>
                                        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                                            <Icon name='dropdown'/>By Expiry Date
                                        </Accordion.Title>
                                       <Accordion.Content active={activeIndex===0}>
                                           <Form>
                                               <Form.Group grouped>
                                                   <Form.Checkbox  label='Expired Jobs'
                                                       name="showExpired" onChange={this.handleFilter}checked={this.state.filter.showExpired} />
                                                    <Form.Checkbox label= 'Unexpired Jobs'
                                                         name= "showUnexpired" onChange ={this.handleFilter} checked={this.state.filter.showUnexpired}/>
                                                </Form.Group>
                                           </Form>
                                       </Accordion.Content>
                                   </Accordion>
                               </Dropdown.Item>
                              <button className ="ui teal small button"

                                 style={{width:"100%", borderRadius:"0"}}
                                 onClick={()=> this.loadNewData({activePage :1 })}>

                                  <i className ="filter icon"/>
                                  Filter
                              </button>
                           </Dropdown.Menu>
                       </Dropdown>
                   </span>
                   <span>
                       <i className="calender icon"/>
                       {"Sort by date:"}
                       <Dropdown inline simple options = {options}
                       name ="date"
                       onChange={this.handleSortChange}
                       className="manage-jobs"
                       value={this.state.sortBy.date}/>

                   </span>
            
                  <div className="ui three cards">
                       {
                           res != undefined ?
                           res 
                           :
                           <React.Fragment>
                               <p style=
                               {{
                                   paddingTop: 20,
                                   PaddingBottom: 50,
                                   marginLeft: 15
                               }}>No Jobs Found</p>
                           </React.Fragment>
                       }

                   </div>
                  

                    </div>
                  </div>
                  <div className="centered row">
                      <Pagination
                      ellipsisItem ={{content:<Icon name='ellipsis horizontal'/>,icon:true}}
                      firstItem={{ content:<Icon name='angle double left'/>,icon:true}}
                      lastItem={{content:<Icon name='angle double right'/>,icon:true}}
                      prevItem={{content:<Icon nam='angle left'/>,icon:true}}
                      nextItem={{content:<Icon name='angle right'/>,icon:true}}
                      totalPages={this.state.totalPages}
                      activePage={this.state.activePage}
                      onPageChange={this.handlePaginationChange}
                      />
                  </div>
                  <div className="row">

                  </div>
                  </div>
               </div>
            </BodyWrapper>
        )
    }
}
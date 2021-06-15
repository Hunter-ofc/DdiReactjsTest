import React, { Component } from 'react';
import Axios from 'axios';

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class EmpRegistrationPg extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            name:'',
            emailId: '',
            contactNo: '',
            address: '',
            deptInfo: [],
            empInfo: [],
            selectedDept: 'Software',
            errors: {
                name: '',
                emailId: '',
                contactNo: '',
                address: '',
                others: ''
            }
        }
    }

    componentDidMount() {
        console.log('Component Did Mount');

        this.fetchDeptInfo();

        this.fetchEmpInfo();
  
    }

    fetchDeptInfo() {
        let modifiedState = this.state;

        Axios.get(`http://localhost:3001/api/fetchDeptInfo`)
        .then(response => {
          if(response.data.code == "SUCCESS") {
            console.log("Successfully fetched Department Information");

            console.log(response.data.deptInfo);

            modifiedState.deptInfo = response.data.deptInfo;

            this.setState(modifiedState);
  
          } else {
              modifiedState.errors.others = "Server Experiencing Issues";
          }
          this.setState(modifiedState);
        })
        .catch(error => {
          console.log("Network error:");
          console.log(error);
        });
    } 

    fetchEmpInfo() {
        let modifiedState = this.state;

        Axios.get(`http://localhost:3001/api/fetchEmpInfo`)
        .then(response => {
          if(response.data.code == "SUCCESS") {
            console.log("Successfully fetched Employees Information");

            console.log(response.data.empInfo);

            modifiedState.empInfo = response.data.empInfo;

            this.setState(modifiedState);
  
          } else {
              modifiedState.errors.others = "Server Experiencing Issues";
          }
          this.setState(modifiedState);
        })
        .catch(error => {
          console.log("Network error:");
          console.log(error);
        });
    }
    
    handleChange = (e) => {
        let modifiedState = this.state;
        let errors = this.state.errors;

        const { name, value } = e.target;
      
        switch (name) {
          case 'emailId': 
            errors.emailId = 
              validEmailRegex.test(value)
                ? ""
                : "EmailId is not Valid.";
            break;         
         case 'contactNo': 
            errors.contactNo = 
            (value.length != 10)
                ? "Phone number must be 10 digits long." 
                : "";      
            break;
          default:
            break;
        }
      
        this.setState({
          errors, 
          [name]: value,
          [e.target.name]:e.target.value
          }, ()=> {
        })

    }

    handleDeptChange = (e) => {
        let modifiedState = this.state;

        modifiedState.selectedDept = e.target.value;

        this.setState(modifiedState);
        
    }

    onSupportSubmit = (e) => {
        let modifiedState = this.state;

        let allData = {
            emailId: modifiedState.emailId,
            name: modifiedState.name, 
            contactNo: modifiedState.contactNo, 
            address: modifiedState.address, 
            selectedDept: modifiedState.selectedDept,
          };
      
      Axios.post(`http://localhost:3001/api/insert`, allData)
      .then(response => {
        if(response.data.code == "SUCCESS") {
          alert('Successfully saved employee details.');

          // To Reset Form values back to Default.
          this.showDefaultUserDetails(); 

        } else {
            modifiedState.errors.others = "Server Experiencing Issues";
        }
        this.setState(modifiedState);
      })
      .catch(error => {
        console.log("Network error:");
        console.log(error);
      });

    }

    showDefaultUserDetails() {
        let modifiedState = this.state;
 
        modifiedState.contactNo = '';
        modifiedState.address = '';
        modifiedState.emailId = '';
        modifiedState.name = '';

        this.setState(modifiedState)

    }

    deleteThisEmp = (e) => {
        console.log(e.target.value);

        let modifiedState = this.state;

        let allData = {
            emailId: e.target.value,
          };
      
      Axios.post(`http://localhost:3001/api/delete`, allData)
      .then(response => {
        if(response.data.code == "SUCCESS") {
            this.d=this.fetchEmpInfo();
        } else {
            modifiedState.errors.others = "Server Experiencing Issues";
        }
        this.setState(modifiedState);
      })
      .catch(error => {
        console.log("Network error:");
        console.log(error);
      });

    }

    render() {
        const{errors} = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="container col-lg-5 col-lg-offset-4 col-md-6 col-md-offset-3">
                        <div style={{marginTop: '20%'}}>
                            <h1>Employees Table</h1>
                            <table style={{border: '1px solid black'}}>
                                <thead  style={{border: '1px solid black'}}>
                                    <tr>
                                        <th style={{border: '1px solid black'}}>Sr No.</th>
                                        <th style={{border: '1px solid black'}}>Name</th>
                                        <th style={{border: '1px solid black'}}>Email ID</th>
                                        <th style={{border: '1px solid black'}}>Contact No</th>
                                        <th style={{border: '1px solid black'}}>Address</th>
                                        <th style={{border: '1px solid black'}}>Department</th>
                                        <th style={{border: '1px solid black'}}>Action</th>
                                    </tr>
                                </thead>    
                                <tbody>
                                    {this.state.empInfo.map((singleEmp, index) => {
                                        return (
                                            <tr style={{border: '1px solid black'}}>
                                                <td style={{border: '1px solid black'}}>{index + 1}</td>
                                                <td style={{border: '1px solid black'}}>{singleEmp["empName"]}</td>
                                                <td style={{border: '1px solid black'}}>{singleEmp["empEmail"]}</td>
                                                <td style={{border: '1px solid black'}}>{singleEmp["empContactNo"]}</td>
                                                <td style={{border: '1px solid black'}}>{singleEmp["empAddress"]}</td>
                                                <td style={{border: '1px solid black'}}>{singleEmp["empDept"]}</td>
                                                <td><button onClick={this.deleteThisEmp} value={singleEmp["empEmail"]}>Delete</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div style={{marginTop: '20%', marginBottom: '20%'}}>
                            <h1>Add Employee</h1>
                            <form onSubmit={this.onSupportSubmit} style={{border: '1px solid black'}}>
                                <div style={{marginTop: '1rem', marginBottom: '1rem'}}>
                                    <div style={{paddingTop: '1%', display: 'flex', justifyContent: 'space-around'}}>
                                        <label>Name: </label>
                                        <input type="text" name="name" onChange={this.handleChange} value={this.state.name}/>
                                    </div>
                                    <div style={{paddingTop: '1%', display: 'flex', justifyContent: 'space-around'}}>
                                        <label>Email Id: </label>
                                        <input type="email" name="emailId" onChange={this.handleChange} value={this.state.emailId}/>
                                    </div>
                                    {errors.emailId.length > 0 && 
                                        <h5 style={{color: 'red'}}>{errors.emailId}</h5>} 
                                    <div style={{paddingTop: '1%', display: 'flex', justifyContent: 'space-around'}}>
                                        <label>Contact No: </label>
                                        <input type="number" name="contactNo" onChange={this.handleChange} value={this.state.contactNo}/>
                                    </div>
                                    {errors.contactNo.length > 0 && 
                                        <h5 style={{color: 'red'}}>{errors.contactNo}</h5>} 
                                    <div style={{paddingTop: '1%', display: 'flex', justifyContent: 'space-around'}}>
                                        <label>Address: </label>
                                        <textarea name="address" onChange={this.handleChange} value={this.state.address}/>
                                    </div>
                                    <div style={{paddingTop: '3%', display: 'flex', justifyContent: 'space-around'}}>
                                        <label>Department: </label>
                                        <select onChange={this.handleDeptChange}>
                                            {this.state.deptInfo.map(singleDept => {
                                                return <option key={singleDept["id"]}>{singleDept["deptName"]}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div style={{paddingTop: '1%'}}>
                                        <button type="submit">Submit</button>
                                    </div>
                                    {errors.others.length > 0 && 
                                        <h5 style={{color:'red'}} className='error'>{errors.others}</h5>}

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default EmpRegistrationPg;

import React, { Component } from 'react';
import PlacesAPI from '../placesAPI/search_autocomplete';
import { withRouter, Redirect } from 'react-router-dom';
// import { BusinessContext } from "./context/businessContext";
import axios from 'axios';
import firebase from '../../firebase/firebase';
import glamorous from 'glamorous';
import {
	FixedContainer,
	LandingContainer,
	WelcomePage,
	FormContainerReg,
	FormContainerLog,
	Fieldset,
	Input,
	Button,
	Title,
	TitleBorder,
	Description,
	ButtonContainer,
	RegButton,
	CenterLine,
	LoginButton,
	ChangeForm,
	LogClickHere,
	RegClickHere,
	Legend
} from './business_register_styles';

class BusinessAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			first_name: '',
			last_name: '',
			phone: '',
			email: '',
			password: ''
		};
	}

	// parses phone number and adds in parentheses and dashes
	handlePhoneInput = (e) => {
		if (e.target.value.length === 3) {
			this.setState({ phone: `(${e.target.value})-` });
		} else if (e.target.value.length === 9) {
			this.setState({ phone: `${e.target.value}-` });
		} else this.setState({ [e.target.name]: e.target.value });
	};

	submitForm = async (bizContext) => {
		bizContext.fireSweetAlert_waiting('register');
		let { first_name, last_name, phone, email, password } = this.state;
		if (first_name !== '' && last_name !== '' && phone !== '' && email !== '' && password !== '') {
			// regex only digits from phone number
			const formattedPhoneNumber = this.state.phone.replace(/\D/g, '');

			const owner = {
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				email: this.state.email,
				phone: `+1${formattedPhoneNumber}`, // MUST BE 10 DIGIT NUMBER
				password: this.state.password
			};

			const business = this.props.value.business;

			const allData = {
				business_information: business,
				owner_information: owner
			};

			let x = await axios
				.post('https://us-central1-cs9-rightnow.cloudfunctions.net/haveAsesh/business', allData)
				.then((res) => console.log(`\nsuccessfuly created new business\n${res}`))
				.catch((err) => console.log(`\nerror creating new business\n${err}`));

			await this.handleEmailSignIn(bizContext);

			this.setState({
				first_name: '',
				last_name: '',
				email: '',
				phone: '',
				password: ''
			});
		} else {
			setTimeout(bizContext.fireSweetAlert_error_emptyField, 600);
		}
	};

	handleEmailSignIn = async (bizContext) => {
		// console.log(this.state);
		bizContext.updateState({ loggedfromPage: 'business' });
		bizContext.fireSweetAlert_waiting();
		const confirm_account = await firebase
			.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((res) => {
				bizContext.fireSweetAlert_success('login');
			})
			.catch((err) => {
				setTimeout(bizContext.fireSweetAlert_error, 600);
			});

		return confirm_account;
	};

	// screen transitions
	handleRegisterDisplay = () => {
		document.querySelector('#landing').style.top = '150vh';
		document.querySelector('#register').style.top = 0;
	};

	handleLoginDisplay = () => {
		document.querySelector('#landing').style.top = '-100vh';
		document.querySelector('#login').style.top = 0;
	};

	FromRegToLogin = () => {
		document.querySelector('#register').style.top = '-100vh';
		document.querySelector('#login').style.top = 0;
	};

	FromLogToRegister = () => {
		document.querySelector('#login').style.top = '100vh';
		document.querySelector('#register').style.top = 0;
	};

	render() {
		// if valid Business owner
		if (this.props.value.uid) {
			return <Redirect to="/busn-appts" />;
		} else if (this.props.value.loggedInAs === 'customer') {
			// if not logged in as business owner
			this.props.value.fireSweetAlert_info_as('customer');
			return <Redirect to="/" />;
		} else
			return (
				<FixedContainer>
					<LandingContainer id="swoosh">
						<WelcomePage id="landing">
							<Title>
								<TitleBorder>Sesho: Manager</TitleBorder>
								<Description>MANAGE YOUR APPOINTMENTS WITH A SIMPLE SESSION OF SESHO</Description>
							</Title>
							<ButtonContainer>
								<RegButton onClick={() => this.handleRegisterDisplay()}>Register</RegButton>
								<CenterLine />
								<LoginButton onClick={() => this.handleLoginDisplay()}>Login</LoginButton>
							</ButtonContainer>
						</WelcomePage>

						<FormContainerReg id="register">
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignContent: 'center',
									width: '25%',
									height: '100%',
									margin: 'auto'
								}}
							>
								<Fieldset>
									<Legend>Registration</Legend>
									<ChangeForm>
										<p style={{ margin: 0, marginRight: '2%' }}>Already a Sesho manager?</p>
										<RegClickHere onClick={() => this.FromRegToLogin()}>Login Here</RegClickHere>
									</ChangeForm>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignContent: 'center',
											width: '100%',
											margin: '2% auto'
										}}
									>
										<Input
											type="text"
											name="first_name"
											placeholder="First Name"
											onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
											value={this.state.first_name}
											required
											autocomplete="off"
											style={{ marginRight: '1%', width: '49%', padding: '2% 0' }}
										/>

										<Input
											type="text"
											onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
											name="last_name"
											placeholder="Last Name"
											value={this.state.last_name}
											required
											autocomplete="off"
											style={{ marginLeft: '1%', width: '49%', padding: '2% 0' }}
										/>
									</div>

									<Input
										type="email"
										onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
										name="email"
										placeholder="Email"
										value={this.state.email}
										required
										autocomplete="off"
										style={{ width: '100%', margin: '2% auto', padding: '2% 0' }}
									/>
									<Input
										type="password"
										onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
										name="password"
										placeholder="Password"
										value={this.state.password}
										required
										autocomplete="off"
										style={{ width: '100%', margin: '2% auto', padding: '2% 0' }}
									/>
									<Input
										id="phone"
										type="text"
										maxLength="14"
										onChange={(e) => this.handlePhoneInput(e)}
										name="phone"
										placeholder="Phone Number"
										value={this.state.phone}
										required
										autocomplete="off"
										style={{ width: '100%', margin: '2% auto', padding: '2% 0' }}
									/>
									<PlacesAPI busnContext={this.props.value} style={{ padding: '2% 0' }} />
									<Button onClick={() => this.submitForm(this.props.value)}>Submit</Button>
								</Fieldset>
							</div>
						</FormContainerReg>

						<FormContainerLog id="login">
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignContent: 'center',
									width: '25%',
									height: '100%',
									margin: 'auto'
								}}
							>
								<Fieldset>
									<Legend>Welcome Back</Legend>
									<ChangeForm>
										<p style={{ marginRight: '2%' }}>Not a Sesho manager yet?</p>
										<LogClickHere onClick={() => this.FromLogToRegister()}>
											Register Here
										</LogClickHere>
									</ChangeForm>
									<Input
										type="email"
										onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
										name="email"
										placeholder="Email"
										value={this.state.email}
										required
										style={{ width: '100%', margin: '2% auto', padding: '2% 0' }}
									/>
									<Input
										type="password"
										onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
										name="password"
										placeholder="Password"
										value={this.state.password}
										required
										style={{ width: '100%', margin: '2% auto', padding: '2% 0' }}
									/>
									<Button onClick={() => this.handleEmailSignIn(this.props.value)}>Login</Button>
								</Fieldset>
							</div>
						</FormContainerLog>
					</LandingContainer>
				</FixedContainer>
			);
	}
}

export default withRouter(BusinessAccount);

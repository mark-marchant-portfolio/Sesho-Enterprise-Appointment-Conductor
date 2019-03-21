import React, { Component } from 'react';
import moment from 'moment';
import {
	Container,
	ModalWrapper,
	ElementConainer,
	DetailContainer,
	Greeting,
	YourSesh,
	Activity,
	Spanner,
	Location,
	Icon,
	Time,
	Cost,
	Agreement,
	FinePrint,
	ButtonContainer,
	Button,
	CloseX
} from './confirm_modal_styles';

import iziToast from 'izitoast';
import { UserContext } from '../../context/userContext';

export default class ConfirmModal extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	iziToastNotification = (event) => {
		iziToast.success({
			titleSize: '1.3em',
			messageSize: '1em',
			closeOnClick: true,
			position: 'bottomRight',
			title: `You're all booked!`,
			message: 'Your appointment has been booked!'
		});
	};
	componentDidMount() {
		document.body.style.overflowY = 'hidden';
	}

	componentWillUnmount() {
		document.body.style.overflowY = 'scroll';
	}

	render() {
		return (
			<UserContext.Consumer>
				{(value) => (
					<Container id="confirmModal">
						{console.log('sanity check:', value)}
						{/* <ModalWrapper> */}
						<ElementConainer>
							<Greeting>{value.name}</Greeting>
							<YourSesh>Your Sesh-o is:</YourSesh>
							<DetailContainer>
								<Activity>
									<Spanner>{value.init_appointment.service}</Spanner> at{' '}
									<Spanner>
										{value.init_appointment.business_details.business_information.name}
									</Spanner>
								</Activity>
								<Location>
									on{' '}
									<Spanner>
										{value.init_appointment.business_details.business_information.fullAddress}
									</Spanner>{' '}
									<Icon src="https://seeklogo.com/images/G/google-maps-2014-logo-6108508C7B-seeklogo.com.png" />
								</Location>
								<Time>
									at <Spanner>{`${moment(value.init_appointment.start).format('h:mm')}`}</Spanner>
								</Time>
								<Cost>
									Estimated cost: <Spanner>{value.init_appointment.cost}</Spanner>
								</Cost>
								<Agreement>
									<div className="pretty p-default p-curve">
										<input
											type="checkbox"
											onClick={(e) => value.updateState({ confirm: e.target.checked })}
										/>
										<div className="state p-danger">
											<label>
												<FinePrint>
													I acknowledge that by confirming this session, I am solely
													responsible for <br />any disputes regarding the cost, time and type
													of service I am receiveing.
												</FinePrint>
											</label>
										</div>
									</div>
								</Agreement>
								<ButtonContainer>
									<Button
										onClick={() => {
											value.confirmAppointment(this.iziToastNotification);
										}}
									>
										Got it!
									</Button>
									<Button onClick={() => value.updateState({ displayConfirm: false })}>
										Go back
									</Button>
								</ButtonContainer>
							</DetailContainer>
						</ElementConainer>
						{/* </ModalWrapper> */}
					</Container>
				)}
			</UserContext.Consumer>
		);
	}
}

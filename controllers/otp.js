const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');

const accountSid = 'AC725c424c0f1d444400cb7c2517164abd';
const authToken = '26070148f405858a842d21008fc8fde6';
const smsKey = '54531b1cbb45a1822bb8bd850eea279f81d34718b194834a6646fbf7d26c0f3acd57f3f56a1967ee4c21254d0852dcc5ad9e84d5c9ad282c5933479a4f8d63e3';
const JWT_AUTH_TOKEN='dbf38918e385afac09206632f06e543b430eeb4dfd1d1fa9acbe97efbd0b96d499e871dbe0cf943799f679e8a52c317c69ad0f83626a94303dc26612d1567a56;'
const JWT_REFRESH_TOKEN='e2f97beb82dbfdd5547d9db4d926a9e86845dc1d9ac9103b96fd584d8311f1018ec57fb7b4bffca99aff58ed47ec2953360ae4be56ab03d16c18e1dbfb4f507b';

// const twilioNum =  '';
const client = require('twilio')(accountSid, authToken);

// sendOTP
exports.sendOTP = (req, res) => {
   const phone = req.body.phone;
	const otp = Math.floor(100000 + Math.random() * 900000);
	const ttl = 2 * 60 * 1000;
	const expires = Date.now() + ttl;
	const data = `${phone}.${otp}.${expires}`;
	const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	const fullHash = `${hash}.${expires}`;

	client.messages
		.create({
			body: `Your OTP is ${otp}`,
			from: +12018905559,
			to: phone
		})
		.then((messages) => console.log(messages))
		.catch((err) => console.error(err));

	// res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
	res.status(200).send({ phone, hash: fullHash });
} 

// verifyOTP
exports.verifyOTP = () =>{
	const phone = req.body.phone;
	const hash = req.body.hash;
	const otp = req.body.otp;
	let [ hashValue, expires ] = hash.split('.');

	let now = Date.now();
	if (now > parseInt(expires)) {
		return res.status(504).send({ msg: 'Timeout. Please try again' });
	}
	let data = `${phone}.${otp}.${expires}`;
	let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
	if (newCalculatedHash === hashValue) {
		console.log('user confirmed');
      
		// data save
       const newUser = new User({
			 phone
		 });
		 newUser.save()
		 console.log('data save');

		const accessToken = jwt.sign({ data: phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
		const refreshToken = jwt.sign({ data: phone }, JWT_REFRESH_TOKEN, { expiresIn: '1y' });
		refreshTokens.push(refreshToken);
		res
			.status(202)
			.cookie('accessToken', accessToken, {
				expires: new Date(new Date().getTime() + 30 * 1000),
				sameSite: 'strict',
				httpOnly: true
			})
			.cookie('refreshToken', refreshToken, {
				expires: new Date(new Date().getTime() + 31557600000),
				sameSite: 'strict',
				httpOnly: true
			})
			.cookie('authSession', true, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict' })
			.cookie('refreshTokenID', true, {
				expires: new Date(new Date().getTime() + 31557600000),
				sameSite: 'strict'
			})
			.send({ msg: 'Device verified' });
                

	} else {
		console.log('not authenticated');
		return res.status(400).send({ verification: false, msg: 'Incorrect OTP' });
	}
}
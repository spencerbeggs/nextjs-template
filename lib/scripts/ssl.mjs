import os from "os";
import process from "process";
import util from "util";
import chalk from "chalk";
import * as fs from "fs-extra";
import * as pem from "pem";

const p12Path = `${process.cwd()}/.ssl/nftopia.p12`;
const pkcsCertPath = `${process.cwd()}/.ssl/pkcs/cert.pem`;
const pkcsKeyPath = `${process.cwd()}/.ssl/pkcs/key.pem`;
const serverCertPath = `${process.cwd()}/.ssl/server/cert.pem`;
const serverKeyPath = `${process.cwd()}/.ssl/server/key.pem`;

const createCertificate = util.promisify(pem.createCertificate);
const createPkcs12 = util.promisify(pem.createPkcs12);
const createCSR = util.promisify(pem.createCSR);

try {
	let rootCreds = null;
	let readOpts = {
		encoding: "utf-8"
	};
	let pkcsCertExists = await fs.pathExists(pkcsCertPath);
	let pkcsKeyExists = await fs.pathExists(pkcsKeyPath);
	if (!pkcsCertExists || !pkcsKeyExists) {
		let rootCsr = await createCSR({
			country: "US",
			state: "Delaware",
			locality: "Dover",
			organization: "Mempunk, Inc.",
			organizationUnit: "Root CA",
			commonName: "Mempunk Root CA",
			emailAddress: "hello@mempunk.digital"
		});
		let rootCert = await createCertificate({
			days: 398,
			csr: rootCsr.csr,
			config: rootCsr.config
		});
		await fs.outputFile(pkcsKeyPath, rootCert.serviceKey);
		await fs.outputFile(pkcsCertPath, rootCert.certificate);
		let { pkcs12 } = await createPkcs12(rootCert.serviceKey, rootCert.certificate, "mempunk");
		await fs.outputFile(p12Path, pkcs12);
		rootCreds = {
			key: rootCert.serviceKey,
			cert: rootCert.certificate
		};
	} else {
		rootCreds = {
			key: await fs.readFile(pkcsKeyPath, readOpts),
			cert: await fs.readFile(pkcsKeyPath, readOpts)
		};
	}
	let serverCertExists = await fs.pathExists(serverCertPath);
	let serverKeyExists = await fs.pathExists(serverKeyPath);
	if (!serverCertExists || !serverKeyExists) {
		let serverCsr = await createCSR({
			country: "US",
			state: "Delaware",
			locality: "Dover",
			organization: "Mempunk, Inc.",
			commonName: "local.nftopia.art",
			emailAddress: "hello@mempunk.digital",
			altNames: ["local.nftopian.art", os.hostname(), "localhost"]
		});
		let serverCert = await createCertificate({
			days: 398,
			serviceKey: rootCreds.key,
			serviceCertificate: rootCreds.cert,
			csr: serverCsr.csr,
			config: serverCsr.config
		});
		await fs.outputFile(serverCertPath, serverCert.certificate);
		console.log(chalk.green(`Generated server cert: ${serverCertPath}`));
		await fs.outputFile(serverKeyPath, serverCsr.clientKey);
		console.log(chalk.green(`Generated server key: ${serverKeyPath}`));
		console.log(chalk.yellow(`Add the root certificate to your trusted certs: ${p12Path}`));
	}
} catch (err) {
	console.log(err);
}

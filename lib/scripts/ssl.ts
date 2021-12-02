import { readFile } from "fs/promises";
import os from "os";
import process from "process";
import { promisify } from "util";
import chalk from "chalk";
import * as fse from "fs-extra";
import { CertificateCreationOptions, CertificateCreationResult, CSRCreationOptions, Pkcs12CreationOptions } from "pem";
import * as pem from "pem";
const { pathExists, outputFile } = fse;
const { createCertificate, createPkcs12, createCSR } = pem;

const makeCSR = promisify<CSRCreationOptions, { csr: string; clientKey: string }>(createCSR);
const makeCert = promisify<CertificateCreationOptions, CertificateCreationResult>(createCertificate);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makePkcs12 = promisify<string, string, string, Pkcs12CreationOptions, { pkcs12: any }>(createPkcs12);

const p12Path = `${process.cwd()}/.ssl/nftopia.p12`;
const pkcsCertPath = `${process.cwd()}/.ssl/pkcs/cert.pem`;
const pkcsKeyPath = `${process.cwd()}/.ssl/pkcs/key.pem`;
const serverCertPath = `${process.cwd()}/.ssl/server/cert.pem`;
const serverKeyPath = `${process.cwd()}/.ssl/server/key.pem`;

try {
	let rootCreds = null;
	let pkcsCertExists = await pathExists(pkcsCertPath);
	let pkcsKeyExists = await pathExists(pkcsKeyPath);
	if (!pkcsCertExists || !pkcsKeyExists) {
		const { csr } = await makeCSR({
			country: "US",
			state: "Delaware",
			locality: "Dover",
			organization: "Mempunk, Inc.",
			organizationUnit: "Root CA",
			commonName: "Mempunk Root CA",
			emailAddress: "hello@mempunk.digital"
		});
		const { serviceKey, certificate: serviceCertificate } = await makeCert({
			days: 398,
			csr
		});
		await outputFile(pkcsKeyPath, serviceKey);
		await outputFile(pkcsCertPath, serviceCertificate);
		const { pkcs12 } = await makePkcs12(serviceKey, serviceCertificate, "mempunk", {});
		await outputFile(p12Path, pkcs12);
		rootCreds = {
			serviceKey,
			serviceCertificate
		};
	} else {
		rootCreds = {
			serviceKey: await readFile(pkcsKeyPath, "utf-8"),
			serviceCertificate: await readFile(pkcsKeyPath, "utf-8")
		};
	}
	let serverCertExists = await pathExists(serverCertPath);
	let serverKeyExists = await pathExists(serverKeyPath);
	if (!serverCertExists || !serverKeyExists) {
		const { csr, clientKey } = await makeCSR({
			country: "US",
			state: "Delaware",
			locality: "Dover",
			organization: "Mempunk, Inc.",
			commonName: "local.nftopia.art",
			emailAddress: "hello@mempunk.digital",
			altNames: ["local.nftopian.art", os.hostname(), "localhost"]
		});
		const { certificate } = await makeCert({
			days: 398,
			csr,
			...rootCreds
		});
		console.log(clientKey);
		await fse.outputFile(serverCertPath, certificate);
		console.log(chalk.green(`Generated server cert: ${serverCertPath}`));
		await outputFile(serverKeyPath, clientKey);
		console.log(chalk.green(`Generated server key: ${serverKeyPath}`));
		console.log(chalk.yellow(`Add the root certificate to your trusted certs: ${p12Path}`));
	}
} catch (err) {
	console.log(err);
}

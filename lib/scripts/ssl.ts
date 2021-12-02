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
	// @ts-ignore
	let pkcsCertExists = await pathExists(pkcsCertPath);
	// @ts-ignore
	let pkcsKeyExists = await pathExists(pkcsKeyPath);
	if (!pkcsCertExists || !pkcsKeyExists) {
		// @ts-ignore
		const { csr } = await makeCSR({
			country: "US",
			state: "Delaware",
			locality: "Dover",
			organization: "Mempunk, Inc.",
			organizationUnit: "Root CA",
			commonName: "Mempunk Root CA",
			emailAddress: "hello@mempunk.digital"
		});
		// @ts-ignore
		const { serviceKey, certificate: serviceCertificate } = await makeCert({
			days: 398,
			csr
		});
		// @ts-ignore
		await outputFile(pkcsKeyPath, serviceKey);
		// @ts-ignore
		await outputFile(pkcsCertPath, serviceCertificate);
		// @ts-ignore
		const { pkcs12 } = await makePkcs12(serviceKey, serviceCertificate, "mempunk", {});
		// @ts-ignore
		await outputFile(p12Path, pkcs12);
		rootCreds = {
			serviceKey,
			serviceCertificate
		};
	} else {
		rootCreds = {
			// @ts-ignore
			serviceKey: await readFile(pkcsKeyPath, "utf-8"),
			// @ts-ignore
			serviceCertificate: await readFile(pkcsKeyPath, "utf-8")
		};
	}
	// @ts-ignore
	let serverCertExists = await pathExists(serverCertPath);
	// @ts-ignore
	let serverKeyExists = await pathExists(serverKeyPath);
	if (!serverCertExists || !serverKeyExists) {
		// @ts-ignore
		const { csr, clientKey } = await makeCSR({
			country: "US",
			state: "Delaware",
			locality: "Dover",
			organization: "Mempunk, Inc.",
			commonName: "local.nftopia.art",
			emailAddress: "hello@mempunk.digital",
			altNames: ["local.nftopian.art", os.hostname(), "localhost"]
		});
		// @ts-ignore
		const { certificate } = await makeCert({
			days: 398,
			csr,
			...rootCreds
		});
		console.log(clientKey);
		// @ts-ignore
		await fse.outputFile(serverCertPath, certificate);
		console.log(chalk.green(`Generated server cert: ${serverCertPath}`));
		// @ts-ignore
		await outputFile(serverKeyPath, clientKey);
		console.log(chalk.green(`Generated server key: ${serverKeyPath}`));
		console.log(chalk.yellow(`Add the root certificate to your trusted certs: ${p12Path}`));
	}
} catch (err) {
	console.log(err);
}

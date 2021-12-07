import { readFile } from "fs/promises";
import os from "os";
import { promisify } from "util";
import * as fse from "fs-extra";
import { CertificateCreationOptions, CertificateCreationResult, CSRCreationOptions, Pkcs12CreationOptions } from "pem";
import * as pem from "pem";

const { pathExists, outputFile } = fse;
const { createCertificate, createPkcs12, createCSR } = pem;
const createCSRAsync = promisify<CSRCreationOptions, { csr: string; clientKey: string }>(createCSR);
const createCertificateAsync = promisify<CertificateCreationOptions, CertificateCreationResult>(createCertificate);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPkcs12Async = promisify<string, string, string, Pkcs12CreationOptions, { pkcs12: any }>(createPkcs12);

interface Pkcs12 {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pkcs12: any;
	serviceKey: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serviceCertificate: any;
	pkcs12Crs: string;
}

export const makePkcs12 = async (
	password = "localhost",
	csrOptions: CSRCreationOptions = {},
	pkcs12Options: Pkcs12CreationOptions = {}
): Promise<Pkcs12> => {
	const { csr: pkcs12Crs } = await createCSRAsync(
		Object.assign(csrOptions, {
			country: "US",
			state: "NY",
			locality: "New York",
			organization: "Localhost, Inc.",
			organizationUnit: "Localhost Root CA",
			commonName: "Localhost Template Root CA",
			emailAddress: "you@localhost.me"
		})
	);
	// @ts-ignore
	const { serviceKey, certificate: serviceCertificate } = await createCertificateAsync({
		days: 398,
		csr: pkcs12Crs
	});
	// @ts-ignore
	const { pkcs12 } = await createPkcs12Async(serviceKey, serviceCertificate, password, pkcs12Options);
	return {
		pkcs12,
		serviceKey,
		serviceCertificate,
		pkcs12Crs
	};
};

interface HttpsCredentialsOptions {
	serviceKey: string;
	serviceCertificate: string;
	commonName: string;
	altNames?: string[];
	country?: string;
	state?: string;
	locality?: string;
	organization?: string;
	emailAddress?: string;
}

interface HttpsCredentialsResults {
	clientKey: string;
	clientCertificate: string;
	clientCsr: string;
}

type HttpsCredentials = Promise<HttpsCredentialsResults>;

export async function makeHttpsCredentials(options: HttpsCredentialsOptions): HttpsCredentials {
	const {
		serviceKey,
		serviceCertificate,
		commonName,
		altNames = [],
		country = "US",
		state = "NY",
		locality = "New York",
		organization = "Localhost, Inc.",
		emailAddress = "you@localhost.me"
	} = options;
	const { csr: clientCsr, clientKey } = await createCSRAsync({
		country,
		state,
		locality,
		organization,
		emailAddress,
		commonName,
		altNames: [...altNames, os.hostname(), "localhost"].filter((value) => typeof value === "string")
	});
	// @ts-ignore
	const { certificate: clientCertificate } = await createCertificateAsync({
		days: 398,
		csr: clientCsr,
		serviceKey,
		serviceCertificate
	});
	return {
		clientKey,
		clientCertificate,
		clientCsr
	};
}

interface CredentialsModelOptions {
	name: string;
	folder: URL;
}

interface Credentials {
	cert: Buffer;
	key: Buffer;
}

interface CredentialFiles {
	pkcs12: URL;
	server: {
		cert: URL;
		key: URL;
		csr: URL;
	};
	root: {
		cert: URL;
		key: URL;
		csr: URL;
	};
}

export function getCredentialsModel(options: CredentialsModelOptions): CredentialFiles {
	const { name, folder } = options;
	return {
		pkcs12: new URL(`${name}/pkcs12.p12`, folder),
		server: {
			cert: new URL(`${name}/server/certificate.pem`, folder),
			key: new URL(`${name}/server/key.pem`, folder),
			csr: new URL(`${name}/server/csr.pem`, folder)
		},
		root: {
			cert: new URL(`${name}/root/certificate.pem`, folder),
			key: new URL(`${name}/root/key.pem`, folder),
			csr: new URL(`${name}/root/csr.pem`, folder)
		}
	};
}

interface SslOptions {
	name?: string;
	commonName: string;
	altNames?: string[];
	folder: URL;
}

type CredentialsResults = {
	created: boolean;
	credentials: Credentials;
	files: CredentialFiles;
};

export async function makeSsl(options: SslOptions): Promise<CredentialsResults> {
	const { name = "localhost", commonName, altNames = [], folder } = options;
	const files = getCredentialsModel({
		name,
		folder
	});
	const { pkcs12, serviceKey, serviceCertificate, pkcs12Crs } = await makePkcs12(name);
	await outputFile(files.pkcs12.pathname, pkcs12);
	await outputFile(files.root.key.pathname, serviceKey);
	await outputFile(files.root.cert.pathname, serviceCertificate);
	await outputFile(files.root.csr.pathname, pkcs12Crs);
	const { clientKey, clientCertificate, clientCsr } = await makeHttpsCredentials({
		commonName,
		altNames,
		serviceKey,
		serviceCertificate
	});
	await outputFile(files.server.key.pathname, clientKey);
	await outputFile(files.server.cert.pathname, clientCertificate);
	await outputFile(files.server.csr.pathname, clientCsr);
	return {
		created: true,
		credentials: {
			key: Buffer.from(clientKey),
			cert: Buffer.from(clientCertificate)
		},
		files
	};
}

interface SslCredentialsOptions {
	name: string;
	folder: URL;
}

export async function hasServerCredentials(options: SslCredentialsOptions): Promise<CredentialsResults | null> {
	const { name, folder } = options;
	const files = getCredentialsModel({
		name,
		folder
	});
	if (!(await pathExists(files.server.cert.pathname)) || !pathExists(files.server.key.pathname)) {
		return null;
	}
	return {
		created: false,
		credentials: {
			key: await readFile(files.server.key.pathname),
			cert: await readFile(files.server.cert.pathname)
		},
		files
	};
}

export async function sslCredentials(options: SslOptions): Promise<CredentialsResults> {
	const { name = "localhost", folder } = options;
	const credentials = await hasServerCredentials({
		name,
		folder
	});
	return credentials ?? (await makeSsl(options));
}

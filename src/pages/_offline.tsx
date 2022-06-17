import { ShellLayout } from "@components/layouts/shell.layout";

export default function Custom404() {
	return (
		<ShellLayout>
			<h1>You are offline</h1>
		</ShellLayout>
	);
}

Custom404.getLayout = ShellLayout.single;
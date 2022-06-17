import { ShellLayout } from "@components/layouts/shell.layout";

export default function Rendering() {
	return (
		<ShellLayout>
			<h1>Adaptive Rendering</h1>
		</ShellLayout>
	);
}

Rendering.getLayout = ShellLayout.single;
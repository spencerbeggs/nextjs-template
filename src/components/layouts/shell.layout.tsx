import { Dialog, Menu, Transition } from "@headlessui/react";
import {
	BellIcon,
	HomeIcon,
	MenuAlt2Icon,
	ChatAlt2Icon,
	DocumentTextIcon,
	TerminalIcon,
	XIcon
} from "@heroicons/react/outline";
import { SearchIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import {  Fragment, ReactElement, useState } from "react";
import { SidebarItem } from "./components/sidebar-item";
import styles from "./shell.module.css";

const navigation = [
	{ name: "Home", href: "/", Icon: HomeIcon, current: true },
	{ name: "Docs", href: "/docs", Icon: DocumentTextIcon, current: false },
	{ name: "FAQ", href: "/faq", Icon: ChatAlt2Icon, current: false },
	{ name: "Tutorials", href: "/tutorials", Icon: TerminalIcon, current: false }
];
const userNavigation = [
	{ name: "Your Profile", href: "#" },
	{ name: "Settings", href: "#" },
	{ name: "Sign out", href: "#" }
];

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}
type Props = {
	children?: React.ReactNode;
};

export function ShellLayout({ children }: Props) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<div className={styles.layout}>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className={styles.dialog} onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
						</Transition.Child>

						<div className="fixed inset-0 z-40 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute top-0 right-0 -mr-12 pt-2">
											<button
												type="button"
												className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XIcon className="h-6 w-6 text-white" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									<div className={styles.logo}>
										<div className={styles.logo_image}>
											<Image
												layout="fill"
												className="h-8 w-auto"
												src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
												alt="Workflow"
											/>
										</div>
									</div>
									<div className="mt-5 h-0 flex-1 overflow-y-auto">
										<nav className="space-y-1 px-2">
											{navigation.map((item) => (
												<Link
													key={item.name}
													href={item.href}
													className={classNames(
														item.current
															? "bg-gray-900 text-white"
															: "text-gray-300 hover:bg-gray-700 hover:text-white",
														"group flex items-center rounded-md px-2 py-2 text-base font-medium"
													)}
												>
													<>
														<item.Icon
															className={classNames(
																item.current
																	? "text-gray-300"
																	: "text-gray-400 group-hover:text-gray-300",
																"mr-4 h-6 w-6 flex-shrink-0"
															)}
															aria-hidden="true"
														/>
														{item.name}
													</>
												</Link>
											))}
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
							<div className="w-14 flex-shrink-0" aria-hidden="true">
								{/* Dummy element to force sidebar to shrink to fit close icon */}
							</div>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className={styles.sidebar_desktop}>
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className={styles.sidebar_desktop_component}>
						<div className={styles.sidebar_desktop_component_logo}>
							<div className={styles.sidebar_desktop_component_logo_image}>
								<Image
									className={styles.sidebar_desktop_component_logo_image_img}
									layout="fill"
									src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
									alt="Workflow"
								/>
							</div>
						</div>
						<div className={styles.sidebar_desktop_component_content}>
							<nav className={styles.sidebar_desktop_component_content_nav}>
								{navigation.map((item) => (
									<SidebarItem {...item} />
								))}
							</nav>
						</div>
					</div>
				</div>
				<div className="flex flex-col md:pl-64">
					<div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
						<button
							type="button"
							className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
						</button>
						<div className="flex flex-1 justify-between px-4">
							<div className="flex flex-1">
								<form className="flex w-full md:ml-0" action="#" method="GET">
									<label htmlFor="search-field" className="sr-only">
										Search
									</label>
									<div className="relative w-full text-gray-400 focus-within:text-gray-600">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
											<SearchIcon className="h-5 w-5" aria-hidden="true" />
										</div>
										<input
											id="search-field"
											className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
											placeholder="Search"
											type="search"
											name="search"
										/>
									</div>
								</form>
							</div>
							<div className="ml-4 flex items-center md:ml-6">
								<button
									type="button"
									className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>

								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<Menu.Button className={styles.userMenu}>
											<span className="sr-only">Open user menu</span>
											<Image
												className="h-8 w-8 rounded-full"
												layout="fill"
												src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
												alt=""
											/>
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											{userNavigation.map((item) => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<a
															href={item.href}
															className={classNames(
																active ? "bg-gray-100" : "",
																"block px-4 py-2 text-sm text-gray-700"
															)}
														>
															{item.name}
														</a>
													)}
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					<main className={styles.main}>
						<div className={styles.main_inner}>
							<div className={styles.main_inner_content}>
								{children}
								<div className={styles.main_inner_target}>
									<div className={styles.main_inner_target_area} />
								</div>
								{/* /End replace */}
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
};

ShellLayout.single = function getLayout(page: ReactElement) {
	return <ShellLayout>{page}</ShellLayout>;
};
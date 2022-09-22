import { Dialog, Menu, Transition } from "@headlessui/react";
import {
	BellIcon,
	HomeIcon,
	Bars3BottomLeftIcon,
	ChatBubbleLeftEllipsisIcon,
	DocumentTextIcon,
	CommandLineIcon,
	CogIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/future/image";
import Link from "next/link";
import {  Fragment, ReactElement, useState } from "react";
import { SidebarItem } from "./components/sidebar-item";
import logo from "./logo.svg";

const navigation = [
	{ name: "Home", href: "/", Icon: HomeIcon, current: true },
	{ name: "Docs", href: "/docs", Icon: DocumentTextIcon, current: false },
	{ name: "FAQ", href: "/faq", Icon: ChatBubbleLeftEllipsisIcon, current: false },
	{ name: "Tutorials", href: "/tutorials", Icon: CommandLineIcon, current: false }
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
			<div data-x="shell-layout" className="min-h-screen">
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
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
												<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									<div data-x="logo" className="flex h-8 w-full flex-shrink-0 px-4">
										<Link href="/" data-x="logo-container">
											<a className="relative flex h-full w-32  items-start">
												<Image
													style={{ maxWidth: "100%", height: "auto" }}
													className="h-8 w-auto"
													src={logo}
													alt="Logo"
													priority={true}
												/>
											</a>
										</Link>
									</div>
									<div className="mt-5 h-0 flex-1 overflow-y-auto">
										<nav className="space-y-1 px-2">
											{navigation.map(({ name, href, current, Icon }) => (
												<Link key={name} href={href}>
													<a
														className={classNames(
															current
																? "bg-gray-900 text-white"
																: "text-gray-300 hover:bg-gray-700 hover:text-white",
															"group flex items-center rounded-md px-2 py-2 text-base font-medium"
														)}
													>
														<Icon
															className={classNames(
																current
																	? "text-gray-300"
																	: "text-gray-400 group-hover:text-gray-300",
																"mr-4 h-6 w-6 flex-shrink-0"
															)}
															aria-hidden="true"
														/>
														<span>{name}</span>
													</a>
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
				<div data-x="sidebar-desktop" className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex min-h-0 flex-1 flex-col bg-gray-800">
						<div data-x="logo" className="box-content flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
							<Link href="/" data-x="image-wrapper" className="relative flex h-full w-full">
								<a>
									<Image
										className="h-8 object-contain"
										style={{ maxWidth: "100%", height: "auto" }}
										src={logo}
										alt="Logo"
										priority={true}
									/>
								</a>
							</Link>
						</div>
						<div data-x="content" className="flex flex-1 flex-col overflow-y-auto">
							<nav data-x="nav" className="flex-1 space-y-1 px-2 py-4">
								{navigation.map((item) => (
									<SidebarItem key={item.href} {...item} />
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
							<Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
						</button>
						<div className="flex flex-1 justify-between px-4">
							<div className="flex flex-1">
								<form className="flex w-full md:ml-0" action="#" method="GET">
									<label htmlFor="search-field" className="sr-only">
										Search
									</label>
									<div className="relative w-full text-gray-400 focus-within:text-gray-600">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
											<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
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
										<Menu.Button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
											<span className="sr-only">Open user menu</span>
											<CogIcon className="h-6 w-6" aria-hidden="true" />
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

					<main data-x="main" className="flex-1">
						<div className="py-6">
							<div data-x="content-area" className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
								{children}
								<div data-x="content-target" className="py-4">
									<div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
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
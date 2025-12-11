
const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    {[
                        { name: 'Facebook', href: '#' },
                        { name: 'Instagram', href: '#' },
                        { name: 'Twitter', href: '#' },
                        { name: 'GitHub', href: '#' },
                    ].map((item) => (
                        <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">{item.name}</span>
                            {/* Simplified icons */}
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                        </a>
                    ))}
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; 2024 LeadRockets, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

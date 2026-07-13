import { Link } from "@inertiajs/react";

export default function Pagination({ links, queryParams = {} }) {
    const filteredQueryParams = { ...queryParams };
    delete filteredQueryParams.page;
  
    const queryString = Object.keys(filteredQueryParams)
      .filter(key => filteredQueryParams[key] !== null && filteredQueryParams[key] !== undefined && filteredQueryParams[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filteredQueryParams[key])}`)
      .join('&');
  
    return (
      <nav className="flex flex-wrap justify-center gap-2 mt-6 mb-10">
        {links.map((link, idx) => {
          const isDisabled = !link.url;
          const urlWithQuery = link.url
            ? `${link.url}${link.url.includes('?') || queryString === '' ? '' : '?'}${queryString ? '&' + queryString : ''}`
            : '#';
  
          return (
            <Link
              key={idx}
              href={urlWithQuery}
              preserveScroll
              className={`mx-1 px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                link.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-100'
              } ${!link.url && 'pointer-events-none opacity-50'}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
      </nav>
    );
  }
  

import { PYQ_TABS } from '../../constants/pyqConstants'

export default function PyqTabs({ activeTab, onTabChange }) {
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[#3c3c3c] px-1 pb-px">
      {PYQ_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={[
            'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors duration-150',
            activeTab === tab.key
              ? 'border-[#0e639c] text-[#e8e8e8]'
              : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc]',
          ].join(' ')}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

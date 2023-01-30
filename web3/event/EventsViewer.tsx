import {Event, EventItem} from '#/web3/event/Event';
import {Boundary} from '#/ui/Boundary';
import {useI18n} from '#/utils/language';

const I18N = {
  eventFilters: {en: 'Filters', fr: 'Filtres'},
  eventLogs: {en: 'Events Logs', fr: 'Evennements'},
}

/**
 * TODO Comment
 * @param events
 * @param className
 * @param props
 * @constructor
 */
export const EventsViewer = ({events, className, ...props}: { events: Event[], className?: string }) => {

  const i18n = useI18n(I18N)

  return (
    <div>
      <Boundary labels={[events.length + ' ' + i18n.eventLogs]}>
        <div className={'flex flex-col overflow-y-auto lightScrollBar ' + (className || '')} {...props}>
          {events.map((event: any, index: number) => (
            <EventItem key={index} event={event}/>
          ))}
        </div>
      </Boundary>
    </div>
  )
}

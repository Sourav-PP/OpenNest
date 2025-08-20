import { Weekday } from 'rrule';

export const WEEKDAY_MAP: Record<string, Weekday> = {
    MO: new Weekday(0),
    TU: new Weekday(1),
    WE: new Weekday(2),
    TH: new Weekday(3),
    FR: new Weekday(4),
    SA: new Weekday(5),
    SU: new Weekday(6),
};

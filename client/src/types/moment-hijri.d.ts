declare module 'moment-hijri' {
  import { Moment } from 'moment';
  
  interface MomentHijri extends Moment {
    format(format?: string): string;
  }
  
  function momentHijri(date?: any, format?: string): MomentHijri;
  
  export = momentHijri;
}

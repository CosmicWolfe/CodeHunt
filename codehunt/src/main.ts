import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


declare global {
  interface Filter {
    minRating : number,
    maxRating : number,

    tags : string[],
    tagsTakenByOr : boolean,

    /**  
     * 0 - All problems
     * 1 - Not solved by user
     * 2 - Solved by user
     */
    solvedByUser : number,

    /**  
     * "rating"
     * "solvedCount" 
     * "index"
     */
    sortBy : string,

    ascending : boolean,

    numberOfRows : number
  }
}

export interface Filter {
  minRating : number,
  maxRating : number,

  tags : string[],
  tagsTakenByOr : boolean,

  /**  
   * 0 - All problems
   * 1 - Not solved by user
   * 2 - Solved by user
   * 3 - Attempted by user
   */
  relationToUser : number
}

export class FilterConstants {
  static DEFAULT_FILTERS : Filter = {
    minRating: 0,
    maxRating: 3500,
    tags: [],
    tagsTakenByOr: false,
    relationToUser: 0
  }
}

export interface Question {
  contestId: number,
  problemsetName: string,
  problemId: string,
  index: string,
  name: string,
  /**
   * ENUM: PROGRAMMING, QUESTION
   */
  type: string,
  points: number,
  rating: number,
  tags: string[],
  solvedByUser: boolean,
  attemptedByUser: boolean,
  solvedCount: number
}

export interface Tag {
  name : string,
  isActive : boolean;
}

export class TagConstants {
  static LIST_OF_TAGS : string[]  = ['2-sat', 'binary search', 'bitmasks', 'brute force', 'chinese remainder theorem', 'combinatorics',
  'constructive algorithms', 'data structures', 'dfs and similar', 'divide and conquer', 'dp', 'dsu', 'expression parsing',
  'fft', 'flows', 'games', 'geometry', 'graph matchings', 'graphs', 'greedy', 'hashing', 'implementation', 'interactive',
  'math', 'matrices', 'meet-in-the-middle', 'number theory', 'probabilities', 'schedules', 'shortest paths', 'sortings',
  'string suffix structures', 'strings', 'ternary search', 'trees', 'two pointers'];
}

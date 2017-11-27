
import psalter_json from '../../../data/PsalterJSON.json';
import {PSALTER_ACTIONS} from '../actions/psalter-actions';

export function psalter(state = {}, action = {}) {
  if (action.type === PSALTER_ACTIONS.SWIPE) {
    if (isNaN(action.next_val)) return state;
    const next_val = ((_next_val) => {
      if (_next_val < 0) return 0;
      if (_next_val > psalter_json.length) return psalter_json.length;
      return _next_val;
    })(action.next_val);
    return {content: psalter_json[next_val], index: next_val};
  }
  return {content: psalter_json[0], index: 0};
};
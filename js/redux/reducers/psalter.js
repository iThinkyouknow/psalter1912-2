
import psalter_json from '../../../data/PsalterJSON.json';

export function psalter(state = {}, action = {}) {
  return psalter_json[0];
};
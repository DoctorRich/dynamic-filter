import { DateTime } from 'luxon';
import { FilterRuntimValueGetter } from "../factory/filterFactory";

// Tokens
export const NOW_TOKEN = 'NOW';
export const TODAY_TOKEN = 'TODAY';

// Getters
export const NOW_RUNTIME_GETTER: FilterRuntimValueGetter = () => DateTime.local();
export const TODAY_RUNTIME_GETTER: FilterRuntimValueGetter = () => DateTime.local().startOf('day');

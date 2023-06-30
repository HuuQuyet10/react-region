import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';
import {RoleConst} from "../../../constants";

const AppUser = (state: RootState) => state.socket;


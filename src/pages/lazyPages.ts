import { lazy } from 'react';

// Route-level code splitting. The loader functions are exported so the chunk
// can be prefetched (e.g. when a project card is hovered) before navigation.
export const loadProjectDetail = () => import('./ProjectDetail');
export const loadNotFound = () => import('./NotFound');

export const ProjectDetail = lazy(loadProjectDetail);
export const NotFound = lazy(loadNotFound);

'use client';

import { Building2, ClipboardList, Users2, ShieldCheck, Bell, Settings } from 'lucide-react';
import styles from './schoolrep.module.css';

export default function SchoolRepPage() {
  return (
    <div className={styles['min-h-screen'] + ' ' + styles['bg-gray-50']}>
      <header className={styles['bg-white'] + ' ' + styles['shadow-sm'] + ' ' + styles['border-b']}>
        <div className={styles['max-w-7xl'] + ' ' + styles['mx-auto'] + ' ' + styles['px-4'] + ' ' + styles['sm:px-6'] + ' ' + styles['lg:px-8']}>
          <div className={styles['flex'] + ' ' + styles['justify-between'] + ' ' + styles['items-center'] + ' ' + styles['py-4']}>
            <h1 className={styles['text-2xl'] + ' ' + styles['font-bold'] + ' ' + styles['text-gray-900']}>School Representative Dashboard</h1>
            <div className={styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['space-x-4']}>
              <button className={styles['p-2'] + ' ' + styles['text-gray-400'] + ' ' + styles['hover:text-gray-600']}>
                <Bell className={styles['h-5'] + ' ' + styles['w-5']} />
              </button>
              <button className={styles['p-2'] + ' ' + styles['text-gray-400'] + ' ' + styles['hover:text-gray-600']}>
                <Settings className={styles['h-5'] + ' ' + styles['w-5']} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles['max-w-7xl'] + ' ' + styles['mx-auto'] + ' ' + styles['py-6'] + ' ' + styles['sm:px-6'] + ' ' + styles['lg:px-8']}>
        <div className={styles['px-4'] + ' ' + styles['py-6'] + ' ' + styles['sm:px-0']}>
          <div className={styles['grid'] + ' ' + styles['grid-cols-1'] + ' ' + styles['md:grid-cols-2'] + ' ' + styles['lg:grid-cols-4'] + ' ' + styles['gap-6'] + ' ' + styles['mb-8']}>
            <div className={styles['bg-white'] + ' ' + styles['overflow-hidden'] + ' ' + styles['shadow'] + ' ' + styles['rounded-lg']}>
              <div className={styles['p-5']}>
                <div className={styles['flex'] + ' ' + styles['items-center']}>
                  <div className={styles['shrink-0'] + ' ' + styles['h-10'] + ' ' + styles['w-10']}>
                    <div className={styles['h-10'] + ' ' + styles['w-10'] + ' ' + styles['rounded-full'] + ' ' + styles['bg-gray-300'] + ' ' + styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-center']}>
                      <span className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-700']}>JD</span>
                    </div>
                  </div>
                  <div className={styles['ml-4']}>
                    <div className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-900']}>John Doe</div>
                    <div className={styles['text-sm'] + ' ' + styles['text-gray-500']}>Applied for Computer Science</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['bg-white'] + ' ' + styles['overflow-hidden'] + ' ' + styles['shadow'] + ' ' + styles['rounded-lg']}>
              <div className={styles['p-5']}>
                <div className={styles['flex'] + ' ' + styles['items-center']}>
                  <div className={styles['shrink-0'] + ' ' + styles['h-10'] + ' ' + styles['w-10']}>
                    <div className={styles['h-10'] + ' ' + styles['w-10'] + ' ' + styles['rounded-full'] + ' ' + styles['bg-gray-300'] + ' ' + styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-center']}>
                      <span className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-700']}>JS</span>
                    </div>
                  </div>
                  <div className={styles['ml-4']}>
                    <div className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-900']}>Jane Smith</div>
                    <div className={styles['text-sm'] + ' ' + styles['text-gray-500']}>Applied for Business Administration</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['bg-white'] + ' ' + styles['overflow-hidden'] + ' ' + styles['shadow'] + ' ' + styles['rounded-lg']}>
              <div className={styles['p-5']}>
                <div className={styles['flex'] + ' ' + styles['items-center']}>
                  <div className={styles['shrink-0'] + ' ' + styles['h-10'] + ' ' + styles['w-10']}>
                    <div className={styles['h-10'] + ' ' + styles['w-10'] + ' ' + styles['rounded-full'] + ' ' + styles['bg-gray-300'] + ' ' + styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-center']}>
                      <span className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-700']}>AS</span>
                    </div>
                  </div>
                  <div className={styles['ml-4']}>
                    <div className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-900']}>Alice Smith</div>
                    <div className={styles['text-sm'] + ' ' + styles['text-gray-500']}>Applied for Arts</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['bg-white'] + ' ' + styles['overflow-hidden'] + ' ' + styles['shadow'] + ' ' + styles['rounded-lg']}>
              <div className={styles['p-5']}>
                <div className={styles['flex'] + ' ' + styles['items-center']}>
                  <div className={styles['shrink-0'] + ' ' + styles['h-10'] + ' ' + styles['w-10']}>
                    <div className={styles['h-10'] + ' ' + styles['w-10'] + ' ' + styles['rounded-full'] + ' ' + styles['bg-gray-300'] + ' ' + styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-center']}>
                      <span className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-700']}>DS</span>
                    </div>
                  </div>
                  <div className={styles['ml-4']}>
                    <div className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-900']}>David Smith</div>
                    <div className={styles['text-sm'] + ' ' + styles['text-gray-500']}>Applied for Science</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles['bg-white'] + ' ' + styles['shadow'] + ' ' + styles['overflow-hidden'] + ' ' + styles['sm:rounded-md']}>
            <div className={styles['px-4'] + ' ' + styles['py-5'] + ' ' + styles['sm:px-6']}>
              <h3 className={styles['text-lg'] + ' ' + styles['leading-6'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-900']}>Recent Applications</h3>
              <p className={styles['mt-1'] + ' ' + styles['max-w-2xl'] + ' ' + styles['text-sm'] + ' ' + styles['text-gray-500']}>Review and manage student applications.</p>
            </div>
            <ul className={styles['divide-y'] + ' ' + styles['divide-gray-200']}>
              <li>
                <div className={styles['px-4'] + ' ' + styles['py-4'] + ' ' + styles['sm:px-6']}>
                  <div className={styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-between']}>
                    <div className={styles['flex'] + ' ' + styles['items-center']}>
                      <div className={styles['shrink-0'] + ' ' + styles['h-10'] + ' ' + styles['w-10']}>
                        <div className={styles['h-10'] + ' ' + styles['w-10'] + ' ' + styles['rounded-full'] + ' ' + styles['bg-gray-300'] + ' ' + styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-center']}>
                          <span className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-700']}>JD</span>
                        </div>
                      </div>
                      <div className={styles['ml-4']}>
                        <div className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-900']}>John Doe</div>
                        <div className={styles['text-sm'] + ' ' + styles['text-gray-500']}>Applied for Computer Science</div>
                      </div>
                    </div>
                    <div className={styles['flex'] + ' ' + styles['items-center']}>
                      <span className={styles['inline-flex'] + ' ' + styles['items-center'] + ' ' + styles['px-2.5'] + ' ' + styles['py-0.5'] + ' ' + styles['rounded-full'] + ' ' + styles['text-xs'] + ' ' + styles['font-medium'] + ' ' + styles['bg-yellow-100'] + ' ' + styles['text-yellow-800']}>
                        Pending
                      </span>
                      <button className={styles['ml-4'] + ' ' + styles['text-indigo-600'] + ' ' + styles['hover:text-indigo-900']}>Review</button>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles['px-4'] + ' ' + styles['py-4'] + ' ' + styles['sm:px-6']}>
                  <div className={styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-between']}>
                    <div className={styles['flex'] + ' ' + styles['items-center']}>
                      <div className={styles['shrink-0'] + ' ' + styles['h-10'] + ' ' + styles['w-10']}>
                        <div className={styles['h-10'] + ' ' + styles['w-10'] + ' ' + styles['rounded-full'] + ' ' + styles['bg-gray-300'] + ' ' + styles['flex'] + ' ' + styles['items-center'] + ' ' + styles['justify-center']}>
                          <span className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-700']}>JS</span>
                        </div>
                      </div>
                      <div className={styles['ml-4']}>
                        <div className={styles['text-sm'] + ' ' + styles['font-medium'] + ' ' + styles['text-gray-900']}>Jane Smith</div>
                        <div className={styles['text-sm'] + ' ' + styles['text-gray-500']}>Applied for Business Administration</div>
                      </div>
                    </div>
                    <div className={styles['flex'] + ' ' + styles['items-center']}>
                      <span className={styles['inline-flex'] + ' ' + styles['items-center'] + ' ' + styles['px-2.5'] + ' ' + styles['py-0.5'] + ' ' + styles['rounded-full'] + ' ' + styles['text-xs'] + ' ' + styles['font-medium'] + ' ' + styles['bg-green-100'] + ' ' + styles['text-green-800']}>
                        Approved
                      </span>
                      <button className={styles['ml-4'] + ' ' + styles['text-indigo-600'] + ' ' + styles['hover:text-indigo-900']}>View</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
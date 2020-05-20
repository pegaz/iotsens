/*
 * Copyright (c) 2014-2018 Cesanta Software Limited
 * All rights reserved
 *
 * Licensed under the Apache License, Version 2.0 (the ""License"");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an ""AS IS"" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "mgos.h"
#include "mgos_mqtt.h"
#include "user_interface.h"

void goto_deep_sleep(int time_s) {
  LOG(LL_INFO, ("Entering deep sleep for %d [s]", time_s));
  mgos_event_trigger(MGOS_EVENT_REBOOT, NULL);
  mgos_mqtt_global_disconnect();
  mgos_wifi_disconnect();
  mgos_wifi_deinit();
  mgos_debug_flush();
  system_deep_sleep(time_s * 1000000);
}

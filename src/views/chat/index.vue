<!--<script setup lang='ts'>-->
<!--import { computed, onMounted, onUnmounted, ref } from 'vue'-->
<!--import { useRoute } from 'vue-router'-->
<!--import { NButton, NInput, useDialog } from 'naive-ui'-->
<!--import { Message } from './components'-->
<!--import { useScroll } from './hooks/useScroll'-->
<!--import { useChat } from './hooks/useChat'-->
<!--import { useCopyCode } from './hooks/useCopyCode'-->
<!--import { HoverButton, SvgIcon } from '@/components/common'-->
<!--import { useBasicLayout } from '@/hooks/useBasicLayout'-->
<!--import { useChatStore } from '@/store'-->
<!--import { fetchChatAPIProcess } from '@/api'-->
<!--import { t } from '@/locales'-->

<!--let controller = new AbortController()-->

<!--const route = useRoute()-->
<!--const dialog = useDialog()-->

<!--const chatStore = useChatStore()-->

<!--useCopyCode()-->
<!--const { isMobile } = useBasicLayout()-->
<!--const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()-->
<!--const { scrollRef, scrollToBottom } = useScroll()-->

<!--const { uuid } = route.params as { uuid: string }-->

<!--const dataSources = computed(() => chatStore.getChatByUuid(+uuid))-->
<!--const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !item.error)))-->

<!--const prompt = ref<string>('')-->
<!--const loading = ref<boolean>(false)-->

<!--function handleSubmit() {-->
<!--  onConversation()-->
<!--}-->

<!--async function onConversation() {-->
<!--  const message = prompt.value-->

<!--  if (loading.value)-->
<!--    return-->

<!--  if (!message || message.trim() === '')-->
<!--    return-->

<!--  controller = new AbortController()-->

<!--  addChat(-->
<!--    +uuid,-->
<!--    {-->
<!--      dateTime: new Date().toLocaleString(),-->
<!--      text: message,-->
<!--      inversion: true,-->
<!--      error: false,-->
<!--      conversationOptions: null,-->
<!--      requestOptions: { prompt: message, options: null },-->
<!--    },-->
<!--  )-->
<!--  scrollToBottom()-->

<!--  loading.value = true-->
<!--  prompt.value = ''-->

<!--  let options: Chat.ConversationRequest = {-->
<!--    "model": "text-davinci-003",-->
<!--  }-->
<!--  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions-->

<!--  if (lastContext)-->
<!--    options = { ...lastContext }-->

<!--  addChat(-->
<!--    +uuid,-->
<!--    {-->
<!--      dateTime: new Date().toLocaleString(),-->
<!--      text: '',-->
<!--      loading: true,-->
<!--      inversion: false,-->
<!--      error: false,-->
<!--      conversationOptions: null,-->
<!--      requestOptions: { prompt: message, options: { ...options } },-->
<!--    },-->
<!--  )-->
<!--  scrollToBottom()-->

<!--  try {-->
<!--    await fetchChatAPIProcess<Chat.ConversationResponse>({-->
<!--      prompt: message,-->
<!--      options,-->
<!--      signal: controller.signal,-->
<!--      onDownloadProgress: ({ event }) => {-->
<!--        const xhr = event.target-->
<!--        const { responseText } = xhr-->
<!--        // Always process the final line-->
<!--        const lastIndex = responseText.lastIndexOf('\n')-->
<!--        let chunk = responseText-->
<!--        if (lastIndex !== -1)-->
<!--          chunk = responseText.substring(lastIndex)-->
<!--        try {-->
<!--          const data = JSON.parse(chunk)-->
<!--          updateChat(-->
<!--            +uuid,-->
<!--            dataSources.value.length - 1,-->
<!--            {-->
<!--              dateTime: new Date().toLocaleString(),-->
<!--              text: data.text ?? '',-->
<!--              inversion: false,-->
<!--              error: false,-->
<!--              loading: false,-->
<!--              conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },-->
<!--              requestOptions: { prompt: message, options: { ...options } },-->
<!--            },-->
<!--          )-->
<!--          scrollToBottom()-->
<!--        }-->
<!--        catch (error) {-->
<!--          //-->
<!--        }-->
<!--      },-->
<!--    })-->
<!--  }-->
<!--  catch (error: any) {-->
<!--    const errorMessage = error?.message ?? t('common.wrong')-->

<!--    if (error.message === 'canceled') {-->
<!--      updateChatSome(-->
<!--        +uuid,-->
<!--        dataSources.value.length - 1,-->
<!--        {-->
<!--          loading: false,-->
<!--        },-->
<!--      )-->
<!--      scrollToBottom()-->
<!--      return-->
<!--    }-->

<!--    const currentChat = getChatByUuidAndIndex(+uuid, dataSources.value.length - 1)-->

<!--    if (currentChat?.text && currentChat.text !== '') {-->
<!--      updateChatSome(-->
<!--        +uuid,-->
<!--        dataSources.value.length - 1,-->
<!--        {-->
<!--          text: `${currentChat.text}\n[${errorMessage}]`,-->
<!--          error: false,-->
<!--          loading: false,-->
<!--        },-->
<!--      )-->
<!--      return-->
<!--    }-->

<!--    updateChat(-->
<!--      +uuid,-->
<!--      dataSources.value.length - 1,-->
<!--      {-->
<!--        dateTime: new Date().toLocaleString(),-->
<!--        text: errorMessage,-->
<!--        inversion: false,-->
<!--        error: true,-->
<!--        loading: false,-->
<!--        conversationOptions: null,-->
<!--        requestOptions: { prompt: message, options: { ...options } },-->
<!--      },-->
<!--    )-->
<!--    scrollToBottom()-->
<!--  }-->
<!--  finally {-->
<!--    loading.value = false-->
<!--  }-->
<!--}-->

<!--async function onRegenerate(index: number) {-->
<!--  if (loading.value)-->
<!--    return-->

<!--  controller = new AbortController()-->

<!--  const { requestOptions } = dataSources.value[index]-->

<!--  const message = requestOptions?.prompt ?? ''-->

<!--  let options: Chat.ConversationRequest = {}-->

<!--  if (requestOptions.options)-->
<!--    options = { ...requestOptions.options }-->

<!--  loading.value = true-->

<!--  updateChat(-->
<!--    +uuid,-->
<!--    index,-->
<!--    {-->
<!--      dateTime: new Date().toLocaleString(),-->
<!--      text: '',-->
<!--      inversion: false,-->
<!--      error: false,-->
<!--      loading: true,-->
<!--      conversationOptions: null,-->
<!--      requestOptions: { prompt: message, ...options },-->
<!--    },-->
<!--  )-->

<!--  try {-->
<!--    await fetchChatAPIProcess<Chat.ConversationResponse>({-->
<!--      prompt: message,-->
<!--      options,-->
<!--      signal: controller.signal,-->
<!--      onDownloadProgress: ({ event }) => {-->
<!--        const xhr = event.target-->
<!--        const { responseText } = xhr-->
<!--        // Always process the final line-->
<!--        const lastIndex = responseText.lastIndexOf('\n')-->
<!--        let chunk = responseText-->
<!--        if (lastIndex !== -1)-->
<!--          chunk = responseText.substring(lastIndex)-->
<!--        try {-->
<!--          const data = JSON.parse(chunk)-->
<!--          updateChat(-->
<!--            +uuid,-->
<!--            index,-->
<!--            {-->
<!--              dateTime: new Date().toLocaleString(),-->
<!--              text: data.text ?? '',-->
<!--              inversion: false,-->
<!--              error: false,-->
<!--              loading: false,-->
<!--              conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },-->
<!--              requestOptions: { prompt: message, ...options },-->
<!--            },-->
<!--          )-->
<!--        }-->
<!--        catch (error) {-->
<!--          //-->
<!--        }-->
<!--      },-->
<!--    })-->
<!--  }-->
<!--  catch (error: any) {-->
<!--    if (error.message === 'canceled') {-->
<!--      updateChatSome(-->
<!--        +uuid,-->
<!--        index,-->
<!--        {-->
<!--          loading: false,-->
<!--        },-->
<!--      )-->
<!--      return-->
<!--    }-->

<!--    const errorMessage = error?.message ?? t('common.wrong')-->

<!--    updateChat(-->
<!--      +uuid,-->
<!--      index,-->
<!--      {-->
<!--        dateTime: new Date().toLocaleString(),-->
<!--        text: errorMessage,-->
<!--        inversion: false,-->
<!--        error: true,-->
<!--        loading: false,-->
<!--        conversationOptions: null,-->
<!--        requestOptions: { prompt: message, ...options },-->
<!--      },-->
<!--    )-->
<!--  }-->
<!--  finally {-->
<!--    loading.value = false-->
<!--  }-->
<!--}-->

<!--function handleDelete(index: number) {-->
<!--  if (loading.value)-->
<!--    return-->

<!--  dialog.warning({-->
<!--    title: t('chat.deleteMessage'),-->
<!--    content: t('chat.deleteMessageConfirm'),-->
<!--    positiveText: t('common.yes'),-->
<!--    negativeText: t('common.no'),-->
<!--    onPositiveClick: () => {-->
<!--      chatStore.deleteChatByUuid(+uuid, index)-->
<!--    },-->
<!--  })-->
<!--}-->

<!--function handleClear() {-->
<!--  if (loading.value)-->
<!--    return-->

<!--  dialog.warning({-->
<!--    title: t('chat.clearChat'),-->
<!--    content: t('chat.clearChatConfirm'),-->
<!--    positiveText: t('common.yes'),-->
<!--    negativeText: t('common.no'),-->
<!--    onPositiveClick: () => {-->
<!--      chatStore.clearChatByUuid(+uuid)-->
<!--    },-->
<!--  })-->
<!--}-->

<!--function handleEnter(event: KeyboardEvent) {-->
<!--  if (!isMobile.value) {-->
<!--    if (event.key === 'Enter' && !event.shiftKey) {-->
<!--      event.preventDefault()-->
<!--      handleSubmit()-->
<!--    }-->
<!--  }-->
<!--}-->

<!--function handleStop() {-->
<!--  if (loading.value) {-->
<!--    controller.abort()-->
<!--    loading.value = false-->
<!--  }-->
<!--}-->

<!--const placeholder = computed(() => {-->
<!--  if (isMobile.value)-->
<!--    return t('chat.placeholderMobile')-->
<!--  return t('chat.placeholder')-->
<!--})-->

<!--const buttonDisabled = computed(() => {-->
<!--  return loading.value || !prompt.value || prompt.value.trim() === ''-->
<!--})-->

<!--const wrapClass = computed(() => {-->
<!--  if (isMobile.value)-->
<!--    return ['pt-14', 'pb-16']-->

<!--  return []-->
<!--})-->

<!--const footerClass = computed(() => {-->
<!--  let classes = ['p-4']-->
<!--  if (isMobile.value)-->
<!--    classes = ['p-2', 'pr-4', 'fixed', 'bottom-4', 'left-0', 'right-0', 'z-30', 'h-14', 'overflow-hidden']-->
<!--  return classes-->
<!--})-->

<!--onMounted(() => {-->
<!--  scrollToBottom()-->
<!--})-->

<!--onUnmounted(() => {-->
<!--  if (loading.value)-->
<!--    controller.abort()-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <div class="flex flex-col h-full" :class="wrapClass">-->
<!--    <main class="flex-1 overflow-hidden">-->
<!--      <div-->
<!--        id="scrollRef"-->
<!--        ref="scrollRef"-->
<!--        class="h-full overflow-hidden overflow-y-auto"-->
<!--        :class="[isMobile ? 'p-2' : 'p-4']"-->
<!--      >-->
<!--        <template v-if="!dataSources.length">-->
<!--          <div class="flex items-center justify-center mt-4 text-center text-neutral-300">-->
<!--            <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />-->
<!--            <span>Aha~</span>-->
<!--          </div>-->
<!--        </template>-->
<!--        <template v-else>-->
<!--          <div>-->
<!--            <Message-->
<!--              v-for="(item, index) of dataSources"-->
<!--              :key="index"-->
<!--              :date-time="item.dateTime"-->
<!--              :text="item.text"-->
<!--              :inversion="item.inversion"-->
<!--              :error="item.error"-->
<!--              :loading="item.loading"-->
<!--              @regenerate="onRegenerate(index)"-->
<!--              @delete="handleDelete(index)"-->
<!--            />-->
<!--            <div class="sticky bottom-0 left-0 flex justify-center">-->
<!--              <NButton v-if="loading" type="warning" @click="handleStop">-->
<!--                <template #icon>-->
<!--                  <SvgIcon icon="ri:stop-circle-line" />-->
<!--                </template>-->
<!--                Stop Responding-->
<!--              </NButton>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </div>-->
<!--    </main>-->
<!--    <footer :class="footerClass">-->
<!--      <div class="flex items-center justify-between space-x-2">-->
<!--        <HoverButton @click="handleClear">-->
<!--          <span class="text-xl text-[#4f555e] dark:text-white">-->
<!--            <SvgIcon icon="ri:delete-bin-line" />-->
<!--          </span>-->
<!--        </HoverButton>-->
<!--        <NInput-->
<!--          v-model:value="prompt"-->
<!--          type="textarea"-->
<!--          :autosize="{ minRows: 1, maxRows: 2 }"-->
<!--          :placeholder="placeholder"-->
<!--          @keypress="handleEnter"-->
<!--        />-->
<!--        <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">-->
<!--          <template #icon>-->
<!--            <span class="dark:text-black">-->
<!--              <SvgIcon icon="ri:send-plane-fill" />-->
<!--            </span>-->
<!--          </template>-->
<!--        </NButton>-->
<!--      </div>-->
<!--    </footer>-->
<!--  </div>-->
<!--</template>-->

<template>
  <NConfigProvider
      class="h-full"
      :theme="theme"
      :theme-overrides="themeOverrides"
      :locale="language"
  >
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'

const { theme, themeOverrides } = useTheme()
const { language } = useLanguage()
</script>

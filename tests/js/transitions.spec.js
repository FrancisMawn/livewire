import { wait, waitForElement, waitForDomChange } from 'dom-testing-library'
import { mountAndReturn } from './utils'

test('fade in transition is applied', async () => {
    mountAndReturn(
        '<button wire:click="onClick"></button>',
        '<button wire:click="onClick"></button><span wire:transition.fade></span>'
    )

    document.querySelector('button').click()

    await waitForElement(() => document.querySelector('span'))

    expect(document.querySelector('span').style.opacity).toBe('0')

    await wait(() => {
        expect(document.querySelector('span').style.opacity).toBe('1')
    })
})

test('fade out transition is applied', async () => {
    mountAndReturn(
        '<button wire:click="onClick"></button><span wire:transition.fade.50ms></span>',
        '<button wire:click="onClick"></button>'
    )

    document.querySelector('button').click()

    expect(document.querySelector('span').style.opacity).toBe('')

    await waitForDomChange(document.querySelector('span'), () => {
        expect(document.querySelector('span').style.opacity).toBe('0')
    })

    await waitForDomChange(document.querySelector('span'), () => {
        expect(document.querySelector('span')).toBeNull()
    })
})

test('fade in transition class is applied', async () => {
    mountAndReturn(
        '<button wire:click="onClick"></button>',
        // Because Livewire uses "transitionDuration" to determine when to remove the transitions class
        // we have to set a transition duration inline on the <span> tag.
        '<button wire:click="onClick"></button><span style="transition-duration: .01s" wire:transition="fade"></span>'
    )

    document.querySelector('button').click()

    await waitForElement(() => document.querySelector('span'))

    expect(document.querySelector('span').classList.contains('fade-enter', 'fade-enter-active')).toBeTruthy()

    await waitForDomChange(document.querySelector('span'), () => {
        expect(document.querySelector('span').classList.contains('fade-enter')).toBeFalsy()
        expect(document.querySelector('span').classList.contains('fade-enter-active')).toBeTruthy()
    })

    await waitForDomChange(document.querySelector('span'), () => {
        expect(document.querySelector('span').classList.contains('fade-enter')).toBeFalsy()
        expect(document.querySelector('span').classList.contains('fade-enter-active')).toBeFalsy()
    })
})

test('fade out transition class is applied', async () => {
    mountAndReturn(
`<button wire:click="onClick"></button>
<span style="transition-duration: .01s" wire:transition="fade"></span>`,
`<button wire:click="onClick"></button>`
    )

    document.querySelector('button').click()

    await waitForDomChange(document.querySelector('span'), () => {
        expect(document.querySelector('span').classList.contains('fade-leave')).toBeFalsy()
        expect(document.querySelector('span').classList.contains('fade-leave-active')).toBeTruthy()
    })

    await waitForDomChange(document.querySelector('span'), () => {
        expect(document.querySelector('span').classList.contains('fade-leave')).toBeTruthy()
        expect(document.querySelector('span').classList.contains('fade-leave-active')).toBeTruthy()
    })

    await wait(() => {
        expect(document.querySelector('span')).toBeNull()
    })
})

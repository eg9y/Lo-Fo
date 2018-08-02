import Vue from 'vue'
import GMap from '@/components/home/GMap'

describe('GMap.vue', () => {
  it('checks that the submission form is closed, when component is first opened', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.submissionDialog).to.equal(false)
  })

  it('checks that the map is centered properly when the webpage is refreshed', () => {
    const Constructor = Vue.extend(GMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.center.lat).to.equal(36.994635)
    expect(GMapComponent.center.lng).to.equal(-122.058842)
  })
})

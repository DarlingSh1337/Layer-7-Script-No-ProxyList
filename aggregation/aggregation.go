package aggregation

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"sync"
	"time"
)

type Aggregation struct {
	Successes int           `json:"successes"`
	Failures  int           `json:"failures"`
	TTFB      time.Duration `json:"ttfb"`
	TTLB      time.Duration `json:"ttlb"`
	mutex     sync.Mutex
}

func (a *Aggregation) AddSuccess(ttfb, ttlb time.Duration) {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	a.Successes++
	a.TTFB = a.TTFB + (ttfb-a.TTFB)/time.Duration(a.Successes)
	a.TTLB = a.TTLB + (ttlb-a.TTLB)/time.Duration(a.Successes)
}

func (a *Aggregation) AddFailure() {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	a.Failures++
}

func (a *Aggregation) PrettyPrint() {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	total := a.Successes + a.Failures
	fmt.Printf(`
		FUCKED UP BY DARLING
Total Requests: %d
     Successes: %d
      Failures: %d
  Success Rate: %.5f%%
  Failure Rate: %.5f%%
  Average TTFB: %v
  Average TTLB: %v
         Delta: %v
`,
		total,
		a.Successes,
		a.Failures,
		100*float64(a.Successes)/float64(total),
		100*float64(a.Failures)/float64(total),
		a.TTFB,
		a.TTLB,
		a.TTLB-a.TTFB,
	)
}

func (a *Aggregation) Write(path string) error {
	a.mutex.Lock()
	defer a.mutex.Unlock()

	data, err := json.Marshal(a)
	if err != nil {
		return err
	}
	if err := ioutil.WriteFile(path, data, 0644); err != nil {
		return err
	}
	return nil
}

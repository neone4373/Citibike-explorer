
			function reduceAdd(p, v) {
			    p.total += v['end station longitude'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemove(p, v) {
			    p.total -= v['end station longitude'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitial() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddDuration(p, v) {
			    p.total += v['tripduration'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemoveDuration(p, v) {
			    p.total -= v['tripduration'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitialDuration() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddLong(p, v) {
			    p.total += v['end station longitude'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemoveLong(p, v) {
			    p.total -= v['end station longitude'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitialLong() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddLat(p, v) {
			    p.total += v['end station latitude'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemoveLat(p, v) {
			    p.total -= v['end station latitude'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitialLat() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddAge(p, v) {
			    p.total += v['age'];
			    p.count++;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceRemoveAge(p, v) {
			    p.total -= v['age'];
			    p.count--;
			    p.average = p.total / p.count;
			    return p;
			}
			function reduceInitialAge() {
			    return {
			        total: 0,
			        count: 0,
			        average: 0
			    };
			}
			function reduceAddGender(p, v) {
			    p.count++;
			    return p;
			}
			function reduceRemoveGender(p, v) {
			    p.count--;
			    return p;
			}
			function reduceInitialGender() {
			    return {
			        count: 0
			    };
			}
			function reduceAddBorough(p, v) {
			    p.count++;
			    return p;
			}
			function reduceRemoveBorough(p, v) {
			    p.count--;
			    return p;
			}
			function reduceInitialBorough() {
			    return {
			        count: 0
			    };
			}
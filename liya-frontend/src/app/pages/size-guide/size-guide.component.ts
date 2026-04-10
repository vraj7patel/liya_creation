import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-size-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="size-guide-page">
      <div class="page-header">
        <div class="container">
          <h1>Size Guide</h1>
          <p>Find your perfect fit with our comprehensive size chart</p>
        </div>
      </div>

      <div class="container">
        <div class="size-content">
          <section class="size-section">
            <h2>How to Measure</h2>
            <p>To get the perfect fit, please measure yourself as shown below:</p>
            <ul class="measurement-guide">
              <li>
                <strong>Bust:</strong> Measure around the fullest part of your bust
              </li>
              <li>
                <strong>Waist:</strong> Measure around your natural waistline
              </li>
              <li>
                <strong>Hip:</strong> Measure around the widest part of your hips
              </li>
              <li>
                <strong>Height:</strong> Measure from top to bottom (for length)
              </li>
            </ul>
          </section>

          <section class="size-section">
            <h2>Lehenga/saree Size Chart</h2>
            <div class="table-responsive">
              <table class="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Hip (inches)</th>
                    <th>saree Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>32</td>
                    <td>26</td>
                    <td>36</td>
                    <td>16</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>34</td>
                    <td>28</td>
                    <td>38</td>
                    <td>17</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>36</td>
                    <td>30</td>
                    <td>40</td>
                    <td>18</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>38</td>
                    <td>32</td>
                    <td>42</td>
                    <td>19</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>40</td>
                    <td>34</td>
                    <td>44</td>
                    <td>20</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>42</td>
                    <td>36</td>
                    <td>46</td>
                    <td>21</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="size-section">
            <h2>Kurti/Gown Size Chart</h2>
            <div class="table-responsive">
              <table class="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Length (inches)</th>
                    <th>Sleeve (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>32</td>
                    <td>26</td>
                    <td>40</td>
                    <td>22</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>34</td>
                    <td>28</td>
                    <td>42</td>
                    <td>23</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>36</td>
                    <td>30</td>
                    <td>44</td>
                    <td>24</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>38</td>
                    <td>32</td>
                    <td>46</td>
                    <td>25</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>40</td>
                    <td>34</td>
                    <td>48</td>
                    <td>26</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>42</td>
                    <td>36</td>
                    <td>50</td>
                    <td>27</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="size-section">
            <h2>Standard Saree Blouse Size Chart</h2>
            <div class="table-responsive">
              <table class="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (inches)</th>
                    <th>Length (inches)</th>
                    <th>Sleeve (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>32</td>
                    <td>32</td>
                    <td>14</td>
                    <td>22</td>
                  </tr>
                  <tr>
                    <td>34</td>
                    <td>34</td>
                    <td>15</td>
                    <td>23</td>
                  </tr>
                  <tr>
                    <td>36</td>
                    <td>36</td>
                    <td>15</td>
                    <td>24</td>
                  </tr>
                  <tr>
                    <td>38</td>
                    <td>38</td>
                    <td>16</td>
                    <td>25</td>
                  </tr>
                  <tr>
                    <td>40</td>
                    <td>40</td>
                    <td>16</td>
                    <td>26</td>
                  </tr>
                  <tr>
                    <td>42</td>
                    <td>42</td>
                    <td>17</td>
                    <td>26</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="size-section tips-section">
            <h2>Fitting Tips</h2>
            <ul class="tips-list">
              <li>For ethnic wear, we recommend opting for a slightly looser fit for comfort</li>
              <li>If you're between sizes, choose the larger size for better alteration options</li>
              <li>Measure yourself while wearing light clothing for accurate measurements</li>
              <li>Keep the measuring tape snug but not tight</li>
              <li>For lehengas, consider the waist measurement for the blouse and hip for the skirt</li>
              <li>Custom alterations are available for a perfect fit - contact us for details</li>
            </ul>
          </section>

          <div class="cta-section">
            <p>Need help choosing the right size?</p>
            <a routerLink="/contact" class="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .size-guide-page {
      min-height: 100vh;
      background: var(--color-bg);
    }

    .page-header {
      background: linear-gradient(135deg, var(--color-forest) 0%, #0f2922 100%);
      padding: var(--spacing-3xl) 0;
      margin-bottom: var(--spacing-3xl);
    }

    .page-header h1 {
      font-family: var(--font-heading);
      font-size: var(--font-size-4xl);
      color: white;
      margin-bottom: var(--spacing-sm);
    }

    .page-header p {
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.7);
    }

    .size-content {
      max-width: 900px;
      margin: 0 auto;
      padding-bottom: var(--spacing-4xl);
    }

    .size-section {
      background: var(--color-bg-light);
      padding: var(--spacing-xl);
      border-radius: var(--radius-xl);
      margin-bottom: var(--spacing-lg);
    }

    .size-section h2 {
      font-family: var(--font-heading);
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
      color: var(--color-text);
    }

    .size-section > p {
      color: var(--color-text-light);
      line-height: 1.8;
      margin-bottom: var(--spacing-lg);
    }

    .measurement-guide {
      list-style: none;
      padding: 0;
    }

    .measurement-guide li {
      padding: var(--spacing-sm) 0;
      color: var(--color-text-light);
      border-bottom: 1px solid var(--color-border-light);
    }

    .measurement-guide li:last-child {
      border-bottom: none;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .size-table {
      width: 100%;
      border-collapse: collapse;
    }

    .size-table th,
    .size-table td {
      padding: var(--spacing-md);
      text-align: center;
      border: 1px solid var(--color-border);
    }

    .size-table th {
      background: var(--color-forest);
      color: white;
      font-weight: var(--font-weight-semibold);
    }

    .size-table td {
      color: var(--color-text-light);
    }

    .size-table tbody tr:hover {
      background: var(--color-bg);
    }

    .tips-section ul {
      list-style: none;
      padding: 0;
    }

    .tips-list li {
      padding: var(--spacing-md) 0;
      color: var(--color-text-light);
      position: relative;
      padding-left: var(--spacing-xl);
    }

    .tips-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-secondary);
      font-weight: bold;
    }

    .cta-section {
      text-align: center;
      padding: var(--spacing-2xl);
      background: var(--color-bg-light);
      border-radius: var(--radius-xl);
      margin-top: var(--spacing-xl);
    }

    .cta-section p {
      margin-bottom: var(--spacing-lg);
      color: var(--color-text-light);
    }
  `]
})
export class SizeGuideComponent {}
